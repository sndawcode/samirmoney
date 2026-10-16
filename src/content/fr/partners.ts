import type { MediaSlot } from "@/content/types";

export type Partner = { name: string; logo: MediaSlot };

/**
 * Validated and authorised partner logos only (§1.4, brief S5).
 * Candidates seen on the legacy site, pending validation: Senelec, Woyofal, Sen’Eau, Oolu, Rapido, DER/FJ (A.4).
 * Empty list → the partners section is hidden.
 */
// TODO(client): validated partner list + logo files + authorisation (Appendix D #10)
export const partners: readonly Partner[] = [];
