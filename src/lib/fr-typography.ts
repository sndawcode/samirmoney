const NNBSP = " "; // narrow no-break space

/**
 * French typographic rules applied to every visitor-facing string at render time (§4.4).
 * Idempotent; URLs, times, phone numbers and references are left untouched.
 */
export function frTypo(input: string): string {
  return input
    .replace(/'/g, "’") // typographic apostrophe (the brief uses ’)
    .replace(/\s*([?!;:])(?=[\s)»]|$)/g, `${NNBSP}$1`) // before ? ! ; : — URLs, times and query strings stay untouched
    .replace(/«\s*/g, `«${NNBSP}`)
    .replace(/\s*»/g, `${NNBSP}»`)
    .replace(/\d{1,3}(?:[   ]\d{3})+(?=[   ]?FCFA)/g, (n) => n.replace(/[  ]/g, NNBSP)) // 2 000 000 FCFA
    .replace(/(\d)[  ]?FCFA/g, `$1${NNBSP}FCFA`); // never split an amount from its currency
}
