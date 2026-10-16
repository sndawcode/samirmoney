import Link from "next/link";
import { footer } from "@/content/fr/footer";
import { site } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { Container } from "@/components/ui/section";
import { Address } from "@/components/ui/address";
import { ContactLine } from "@/components/ui/contact-links";
import { StoreBadges } from "@/components/ui/store-badges";
import { ComplianceLine } from "@/components/trust/compliance-line";
import { Photo } from "@/components/ui/photo";

const isExternal = (href: string) => /^https?:\/\//.test(href);
// Evaluated at build time: pages are prerendered, so the year follows each deploy.
const COPYRIGHT_YEAR = new Date().getUTCFullYear();

export function SiteFooter() {
  const socials = Object.entries(site.social).filter(
    (entry): entry is [string, string] => entry[1] !== null,
  );
  return (
    <footer
      data-theme="ink"
      className="border-t border-white/10 bg-ink-950 bg-hairlines pt-20 pb-10 text-white"
    >
      <Container width="media" className="flex flex-col gap-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_3fr]">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label={ui.homeLink}
              className="inline-flex min-h-11 items-center self-start"
            >
              <Photo slot="brand-samirmoney-white" sizes="160px" alt="" className="h-7 w-auto" />
            </Link>
            <StoreBadges app="samirMoney" />
          </div>
          <nav
            aria-label={ui.footerNav}
            className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5"
          >
            {footer.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h2 className="text-eyebrow text-smoke">{column.title}</h2>
                <ul className="flex flex-col">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="grid gap-6 border-t border-white/10 pt-10 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-eyebrow text-smoke">{footer.contactTitle}</h2>
            <Address className="text-sm text-smoke" />
            <ContactLine className="text-white" />
          </div>
          {socials.length > 0 && (
            <ul className="flex gap-4 md:justify-end">
              {socials.map(([name, href]) => (
                <li key={name}>
                  <FooterLink href={href}>{name}</FooterLink>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <ComplianceLine />
          <p className="font-mono text-xs text-smoke">{footer.copyright(COPYRIGHT_YEAR)}</p>
        </div>
        {footer.signOff && <p className="text-sm text-smoke">{footer.signOff}</p>}
      </Container>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  const classes =
    "inline-flex min-h-11 items-center text-sm text-white/85 underline-offset-4 hover:text-white hover:underline";
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {frTypo(children)}
        <span className="sr-only"> ({ui.newTab})</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {frTypo(children)}
    </Link>
  );
}
