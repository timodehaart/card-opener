// Shared collection ownership store (dev-native, localStorage-backed).
//
// This is the single source of truth for "which cards does the user own, and
// how" on the dev branch (no backend yet). Cards are identified by their
// Riftcodex card id (the `id` field from lib/riftcodex.ts).
//
// Teammates' features write into it:
//   - the Card Scanner calls `unlockCard(cardId, "physical")` after a scan
//   - the Pack Opening flow calls `unlockCard(cardId, "digital")`
// and the Collection page reads it (and subscribes to changes).

export type OwnershipSource = "physical" | "digital";

export interface OwnedEntry {
  physical: boolean;
  digital: boolean;
  physicalAt: string | null;
  digitalAt: string | null;
}

export type OwnershipMap = Record<string, OwnedEntry>;

const STORAGE_KEY = "dz-collection-v1";
// Same-tab updates: `storage` events only fire in *other* tabs, so we also emit
// a custom event for the current tab.
const CHANGE_EVENT = "dz-collection-change";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Read the full ownership map. Returns an empty map on the server or if empty. */
export function getOwnership(): OwnershipMap {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OwnershipMap) : {};
  } catch {
    return {};
  }
}

/** Ownership for a single card, or null if the user doesn't own it. */
export function getOwnedEntry(cardId: string): OwnedEntry | null {
  return getOwnership()[cardId] ?? null;
}

function save(map: OwnershipMap): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Grant a card to the user from a given source. Sets the matching boolean +
 * timestamp and leaves the other source untouched, so scanning a card you
 * already opened in a pack keeps both flags. Idempotent.
 */
export function unlockCard(cardId: string, source: OwnershipSource): void {
  const map = getOwnership();
  const now = new Date().toISOString();
  const entry: OwnedEntry = map[cardId] ?? {
    physical: false,
    digital: false,
    physicalAt: null,
    digitalAt: null,
  };

  if (source === "physical") {
    entry.physical = true;
    entry.physicalAt = now;
  } else {
    entry.digital = true;
    entry.digitalAt = now;
  }

  map[cardId] = entry;
  save(map);
}

/** Clear both ownership flags for a card (removes it from the collection). */
export function resetCard(cardId: string): void {
  const map = getOwnership();
  if (map[cardId]) {
    delete map[cardId];
    save(map);
  }
}

/**
 * Subscribe to ownership changes (same tab and other tabs). Returns an
 * unsubscribe function. Useful for the Collection page to stay in sync while
 * the scanner / pack flow add cards.
 */
export function subscribe(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
