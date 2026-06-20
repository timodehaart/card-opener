"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import jsQR from "jsqr";
import { resolveCardByRiftboundId, type RiftcodexCard } from "@/lib/riftcodex";

// Label keywords commonly used for a laptop's built-in camera across
// different OEMs (Apple, Dell, Lenovo, HP, etc.) and OSes.
const BUILT_IN_LABEL_PATTERN = /(facetime|integrated|built[\s-]?in|internal|webcam)/i;

// Known virtual/software camera sources — these should always sort
// AFTER physical hardware devices, regardless of any other signal.
const VIRTUAL_CAMERA_PATTERN =
    /(obs|virtual|snap camera|manycam|xsplit|droidcam|iriun|epoccam|nvidia broadcast|streamlabs|camo|reincubate|ivcam|wecam|elgato)/i;

// Sorts camera devices so the laptop's built-in camera appears first,
// physical/unrecognized hardware comes next, and known virtual camera
// software (OBS, Snap Camera, ManyCam, etc.) is always pushed last.
//
// Priority:
//   0. Confirmed built-in camera (facingMode "user" from a probed
//      track — the standard signal for a front-facing/built-in
//      camera; most external webcams and virtual cams don't report
//      a facingMode at all).
//   1. Label matches a known built-in keyword (facetime, integrated,
//      built-in, internal, webcam) — covers cases where facingMode
//      wasn't available.
//   2. Anything else not recognized as virtual — treated as physical
//      hardware so unfamiliar real devices are never penalized.
//   3. Known virtual camera software — always last.
function sortBuiltInCameraFirst(
    cams: MediaDeviceInfo[],
    builtInDeviceId: string | null
): MediaDeviceInfo[] {
    const score = (d: MediaDeviceInfo) => {
        if (builtInDeviceId && d.deviceId === builtInDeviceId) return 0;
        if (BUILT_IN_LABEL_PATTERN.test(d.label)) return 1;
        if (VIRTUAL_CAMERA_PATTERN.test(d.label)) return 3;
        return 2;
    };
    return [...cams].sort((a, b) => score(a) - score(b));
}

export default function CardScannerPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scanLoopRef = useRef<number | null>(null);
    const activeStreamRef = useRef<MediaStream | null>(null);

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [cardId, setCardId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [card, setCard] = useState<RiftcodexCard | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [switchingCamera, setSwitchingCamera] = useState(false);

    // One-time: ask for permission just to unlock device labels, then
    // immediately release that probe stream. This never touches the
    // video element — only the effect below ever does that, so there's
    // only ever one active camera stream at a time.
    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraError("Camera access isn't supported in this browser.");
            return;
        }

        let cancelled = false;

        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((probeStream) => {
                // Before releasing, check if the default camera this browser
                // opened reports facingMode "user" — the standard signal for
                // a front-facing/built-in camera on laptops and phones.
                const track = probeStream.getVideoTracks()[0];
                let builtInDeviceId: string | null = null;
                try {
                    const caps = track?.getCapabilities?.();
                    const settings = track?.getSettings?.();
                    const facingModes = caps?.facingMode ?? [];
                    if (settings?.deviceId && facingModes.includes("user")) {
                        builtInDeviceId = settings.deviceId;
                    }
                } catch {
                    // getCapabilities isn't supported in every browser; ignore.
                }

                // Release immediately — this stream's only job was to trigger
                // the permission prompt so labels become visible.
                probeStream.getTracks().forEach((t) => t.stop());
                if (cancelled) return;
                return navigator.mediaDevices
                    .enumerateDevices()
                    .then((all) => ({ all, builtInDeviceId }));
            })
            .then((result) => {
                if (cancelled || !result) return;
                const { all, builtInDeviceId } = result;
                const cams = sortBuiltInCameraFirst(
                    all.filter((d) => d.kind === "videoinput"),
                    builtInDeviceId
                );
                setDevices(cams);
                setSelectedDeviceId((prev) => prev || cams[0]?.deviceId || "");
            })
            .catch((err) => {
                console.error("Camera permission error:", err);
                if (!cancelled) {
                    setCameraError(
                        "Camera access was blocked. Allow camera permission for this site and reload."
                    );
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // The single source of truth for the active camera stream. Re-runs on
    // selectedDeviceId change, AND whenever we return to scanning mode
    // (card goes back to null). Explicitly stops whatever stream is
    // currently running BEFORE requesting the new one — some cameras
    // (especially virtual cams) refuse a new request while the previous
    // device hasn't fully released, which is what made switching unreliable.
    useEffect(() => {
        if (!selectedDeviceId || card) return;

        let cancelled = false;

        const stopActiveStream = () => {
            activeStreamRef.current?.getTracks().forEach((t) => t.stop());
            activeStreamRef.current = null;
            if (videoRef.current) videoRef.current.srcObject = null;
        };

        const startStream = async (deviceId: string, attempt = 1): Promise<void> => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: deviceId } },
                });

                if (cancelled) {
                    s.getTracks().forEach((t) => t.stop());
                    return;
                }

                activeStreamRef.current = s;
                setCameraError(null);
                setSwitchingCamera(false);

                const video = videoRef.current;
                if (video) {
                    video.srcObject = s;
                    video.play().catch(() => {
                        /* autoplay restrictions are harmless here since muted+playsInline are set */
                    });
                }
            } catch (err) {
                if (cancelled) return;

                // Some cameras (notably virtual cams like OBS) need a brief
                // moment after the previous device released before they'll
                // accept a new request. Retry once after a short delay.
                if (attempt < 3) {
                    await new Promise((r) => setTimeout(r, 250 * attempt));
                    if (!cancelled) return startStream(deviceId, attempt + 1);
                }

                console.error("Camera error:", err);
                setSwitchingCamera(false);
                setCameraError("Couldn't start that camera. Try selecting a different one.");
            }
        };

        setSwitchingCamera(true);
        stopActiveStream();

        // Give the browser/driver a brief moment to actually release the
        // previous device before requesting the new one.
        const timer = setTimeout(() => {
            if (!cancelled) startStream(selectedDeviceId);
        }, 150);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            stopActiveStream();
        };
    }, [selectedDeviceId, card]);

    const lookupCard = useCallback(async (riftboundId: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await resolveCardByRiftboundId(riftboundId);
            if (result) {
                setCard(result);
            } else {
                setError(`No card found for "${riftboundId}"`);
            }
        } catch (err) {
            console.error("Riftcodex lookup failed:", err);
            setError("Couldn't reach the card database. Try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // QR scanning loop using jsQR (works in every browser, no native
    // BarcodeDetector support required).
    useEffect(() => {
        if (card) return; // pause scanning once a card is found

        let cancelled = false;

        const scanFrame = () => {
            if (cancelled) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });

                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const result = jsQR(imageData.data, imageData.width, imageData.height);

                    if (result?.data && !cancelled) {
                        const value = result.data.trim();
                        if (value) {
                            lookupCard(value);
                            return; // stop loop, lookupCard will set `card` and effect cleans up
                        }
                    }
                }
            }
            scanLoopRef.current = requestAnimationFrame(scanFrame);
        };

        scanLoopRef.current = requestAnimationFrame(scanFrame);

        return () => {
            cancelled = true;
            if (scanLoopRef.current) cancelAnimationFrame(scanLoopRef.current);
        };
    }, [card, lookupCard, selectedDeviceId]);

    const handleManualSubmit = () => {
        if (!cardId.trim()) return;
        lookupCard(cardId.trim());
    };

    const handleCollect = () => {
        // TODO: persist card to the user's collection
        setCard(null);
        setCardId("");
        setExpanded(false);
    };

    return (
        <main className="flex h-full flex-col gap-5 overflow-y-auto bg-white px-4 py-5">

            {!card && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-neutral-500">Camera</label>
                        <select
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            disabled={switchingCamera}
                            className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-800 outline-none disabled:opacity-60"
                        >
                            {devices.length === 0 && <option>{cameraError ? "Camera unavailable" : "Loading cameras…"}</option>}
                            {devices.map((d) => (
                                <option key={d.deviceId} value={d.deviceId}>
                                    {d.label || "Camera"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        <div className="pointer-events-none absolute inset-3 rounded-xl border-2 border-blue-500">
                            <span className="absolute -left-0.5 -top-0.5 h-6 w-6 rounded-tl-lg border-l-[3px] border-t-[3px] border-white" />
                            <span className="absolute -right-0.5 -top-0.5 h-6 w-6 rounded-tr-lg border-r-[3px] border-t-[3px] border-white" />
                            <span className="absolute -bottom-0.5 -left-0.5 h-6 w-6 rounded-bl-lg border-b-[3px] border-l-[3px] border-white" />
                            <span className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-br-lg border-b-[3px] border-r-[3px] border-white" />
                        </div>

                        {switchingCamera && !loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <p className="text-[13px] font-medium text-white">Switching camera…</p>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <p className="text-[13px] font-medium text-white">Looking up card…</p>
                            </div>
                        )}
                    </div>

                    {cameraError && (
                        <p className="text-[13px] text-red-500">{cameraError}</p>
                    )}

                    {error && (
                        <p className="text-[13px] text-red-500">{error}</p>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-neutral-500">Enter Card ID Manually</label>
                        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5">
                            <input
                                type="text"
                                value={cardId}
                                onChange={(e) => setCardId(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                                placeholder="e.g. ogn-001"
                                className="flex-1 text-[14px] text-neutral-800 outline-none placeholder:text-neutral-400"
                            />
                            <button
                                aria-label="Submit card ID"
                                onClick={handleManualSubmit}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
                            >
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {card && (
                <div
                    className="relative flex flex-1 flex-col"
                    style={{ background: "linear-gradient(160deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)", margin: "-20px -16px", padding: "20px 16px" }}
                >
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <div className="w-full rounded-[20px] bg-white px-5 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
                            <p className="mb-4 text-center text-[15px] font-semibold text-neutral-700">
                                {card.name}
                            </p>

                            <button
                                onClick={() => setExpanded(true)}
                                className="mx-auto block overflow-hidden rounded-[10px] shadow-[0_3px_12px_rgba(0,0,0,0.15)]"
                                style={{ width: 150 }}
                            >
                                <Image
                                    src={card.media.image_url}
                                    alt={card.media.accessibility_text || card.name}
                                    width={150}
                                    height={210}
                                    unoptimized
                                    className="h-auto w-full object-cover"
                                />
                            </button>

                            <p className="mt-4 text-center text-[12px] text-neutral-400">
                                Tap card to enlarge
                            </p>
                        </div>
                    </div>

                    <div className="w-full pb-2 pt-4">
                        <button
                            onClick={handleCollect}
                            className="h-[50px] w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] transition-transform active:scale-[0.98]"
                        >
                            Collect Card
                        </button>
                    </div>

                    {expanded && (
                        <div
                            className="absolute inset-0 z-50 flex items-center justify-center"
                            style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.35)" }}
                            onClick={() => setExpanded(false)}
                        >
                            <div className="relative w-[75%]" onClick={(e) => e.stopPropagation()}>
                                <Image
                                    src={card.media.image_url}
                                    alt={card.media.accessibility_text || card.name}
                                    width={280}
                                    height={392}
                                    unoptimized
                                    className="h-auto w-full rounded-[16px] shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}