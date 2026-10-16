import media from "@/content/media.json";
import type { MediaEntry, MediaSlot } from "@/content/types";

export function getMedia(slot: MediaSlot): MediaEntry {
  return media[slot];
}
