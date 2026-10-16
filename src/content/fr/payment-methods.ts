// Payment-method badges orbiting the home 3D globe (client files, 16 Oct 2026 — `pnpm icons` → public/media/icons).
// TODO(client): written permission to display the Visa, Mastercard, Wave, Orange Money, Wizall Money, Mixx by Yas,
// KPay and PI-SPI (BCEAO) marks (§1.4, Appendix D #11). Shown as illustration only, never as a list of accepted methods.

export type PaymentMethodBadge = {
  id: string;
  name: string;
  src: string;
  /** Width / height of the badge artwork. */
  aspect: number;
};

export const paymentMethodBadges: readonly PaymentMethodBadge[] = [
  {
    id: "samir-money",
    name: "Samir Money",
    src: "/media/icons/samir-money.webp",
    aspect: 131 / 128,
  },
  { id: "wave", name: "Wave", src: "/media/icons/wave.webp", aspect: 1 },
  { id: "orange-money", name: "Orange Money", src: "/media/icons/orange-money.webp", aspect: 1 },
  {
    id: "visa-mastercard",
    name: "Visa · Mastercard",
    src: "/media/icons/visa-mastercard.webp",
    aspect: 247 / 128,
  },
  {
    id: "wizall-money",
    name: "Wizall Money",
    src: "/media/icons/wizall-money.webp",
    aspect: 131 / 128,
  },
  { id: "mixx-by-yas", name: "Mixx by Yas", src: "/media/icons/mixx-by-yas.webp", aspect: 1 },
  { id: "kpay", name: "KPay", src: "/media/icons/kpay.webp", aspect: 1 },
  { id: "pi-spi", name: "PI-SPI", src: "/media/icons/pi-spi.webp", aspect: 247 / 128 },
];
