import { cva, type VariantProps } from "class-variance-authority";

/**
 * Button styles. Kept free of tailwind-merge so client components can use them without
 * shipping it (§13 JS budget): size and variant never override each other.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-(--dur-ui) active:scale-[.98]",
    "disabled:pointer-events-none disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        // ink on light / accent on dark (§7)
        // On dark: a thin inner highlight and a soft accent glow on hover; secondary is frosted glass.
        primary:
          "rounded-full bg-ink-950 text-white hover:bg-ink-700 ink:bg-accent ink:text-ink-950 ink:shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] ink:hover:bg-samir-300 ink:hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_8px_32px_-6px_rgb(60_176_136/0.65)]",
        secondary:
          "rounded-full border border-ink-950/20 text-ink-950 hover:border-ink-950 ink:border-white/15 ink:bg-white/[0.04] ink:text-white ink:backdrop-blur-md ink:hover:border-white/40 ink:hover:bg-white/[0.08]",
        ghost: "rounded-full text-ink-950 hover:bg-ink-950/5 ink:text-white ink:hover:bg-white/10",
        link: "text-samir-700 underline-offset-4 hover:underline ink:text-samir-300",
      },
      size: {
        md: "min-h-12 px-6 text-base",
        sm: "min-h-11 px-4 text-sm",
        inline: "min-h-11 px-0 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
