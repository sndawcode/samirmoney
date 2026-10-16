import Link from "next/link";
import { ui } from "@/content/fr/ui";
import { Photo } from "@/components/ui/photo";

const LOGO_SIZES = "160px";

/** Samir Money wordmark; the white version shows on dark surfaces. */
export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      aria-label={ui.homeLink}
      onClick={onNavigate}
      className="inline-flex min-h-11 shrink-0 items-center"
    >
      <Photo slot="brand-samirmoney" sizes={LOGO_SIZES} alt="" className="h-7 w-auto ink:hidden" />
      <Photo
        slot="brand-samirmoney-white"
        sizes={LOGO_SIZES}
        alt=""
        className="hidden h-7 w-auto ink:block"
      />
    </Link>
  );
}
