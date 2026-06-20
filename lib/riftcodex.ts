// lib/riftcodex.ts
// Lightweight client for the Riftcodex Riftbound Card API.
// Docs: https://riftcodex.com/docs/endpoints/cards

const BASE_URL = "https://api.riftcodex.com";

export interface RiftcodexAttributes {
    energy?: number;
    might?: number;
    power?: number;
}

export interface RiftcodexClassification {
    type: string;
    supertype?: string;
    rarity: string;
    domain: string[];
}

export interface RiftcodexText {
    rich: string;
    plain: string;
    flavour?: string;
}

export interface RiftcodexSet {
    set_id: string;
    label: string;
}

export interface RiftcodexMedia {
    image_url: string;
    artist: string;
    accessibility_text: string;
}

export interface RiftcodexMetadata {
    clean_name: string;
    updated_on: string;
    alternate_art: boolean;
    overnumbered: boolean;
    signature: boolean;
}

export interface RiftcodexCard {
    id: string;
    name: string;
    riftbound_id: string;
    tcgplayer_id: string;
    collector_number: number;
    attributes: RiftcodexAttributes;
    classification: RiftcodexClassification;
    text: RiftcodexText;
    set: RiftcodexSet;
    media: RiftcodexMedia;
    tags: string[];
    orientation: "portrait" | "landscape";
    metadata: RiftcodexMetadata;
}

export interface RiftcodexListResponse {
    total: number;
    items: RiftcodexCard[];
}

class RiftcodexError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "RiftcodexError";
        this.status = status;
    }
}

async function request<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`);

    if (!res.ok) {
        throw new RiftcodexError(
            `Riftcodex request failed (${res.status}) for ${path}`,
            res.status
        );
    }

    return (await res.json()) as T;
}

/**
 * Get a single card by its Riftcodex ID.
 * e.g. getCardById("69a6336b829d03360413d515")
 */
export function getCardById(id: string): Promise<RiftcodexCard> {
    return request<RiftcodexCard>(`/cards/${encodeURIComponent(id)}`);
}

/**
 * Get card(s) by their Riftbound ID, e.g. "ogn-011" or "ogn-011-298".
 * This is the format scanned from a QR code or typed manually
 * (e.g. "ogn-11"), so it supports case-insensitive partial matching.
 */
export function getCardsByRiftboundId(
    riftboundId: string
): Promise<RiftcodexCard[]> {
    return request<RiftcodexCard[]>(
        `/cards/riftbound/${encodeURIComponent(riftboundId.trim())}`
    );
}

/**
 * Convenience helper: resolve a scanned/typed card ID (Riftbound ID)
 * to a single best-match card, or null if nothing was found.
 */
export async function resolveCardByRiftboundId(
    riftboundId: string
): Promise<RiftcodexCard | null> {
    try {
        const results = await getCardsByRiftboundId(riftboundId);
        return results?.[0] ?? null;
    } catch (err) {
        if (err instanceof RiftcodexError && err.status === 404) {
            return null;
        }
        throw err;
    }
}

/** Get a single card by its TCGPlayer product ID. */
export function getCardByTcgplayerId(
    tcgplayerId: string
): Promise<RiftcodexCard> {
    return request<RiftcodexCard>(
        `/cards/tcgplayer/${encodeURIComponent(tcgplayerId)}`
    );
}

/** Search cards by exact or fuzzy name match. */
export function getCardsByName(
    params: { exact?: string; fuzzy?: string } & Record<string, string | number | undefined>
): Promise<RiftcodexListResponse> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
    });
    return request<RiftcodexListResponse>(`/cards/name?${query.toString()}`);
}

/** Get a paginated list of cards, optionally filtered by set. */
export function getCards(
    params: Record<string, string | number | undefined> = {}
): Promise<RiftcodexListResponse> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
    });
    const qs = query.toString();
    return request<RiftcodexListResponse>(`/cards${qs ? `?${qs}` : ""}`);
}

/** Full text search across card text. */
export function searchCards(
    query: string,
    params: Record<string, string | number | undefined> = {}
): Promise<RiftcodexListResponse> {
    const qs = new URLSearchParams({ query, ...Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        ) });
    return request<RiftcodexListResponse>(`/cards/search?${qs.toString()}`);
}

export { RiftcodexError };