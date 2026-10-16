import { MessageCircle } from "lucide-react";
import { site } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button-variants";

export function whatsappHref(number: string, text: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

/** WhatsApp CTA with a page-specific prefill. Hidden while the number is unknown (§11.2). */
export function WhatsAppButton({
  prefill,
  page,
  className,
}: {
  prefill: string;
  page: string;
  className?: string;
}) {
  if (!site.whatsapp) return null;
  return (
    <a
      href={whatsappHref(site.whatsapp, prefill)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "secondary" }),
        eventClasses("whatsapp_click", { page }),
        className,
      )}
    >
      <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.5} />
      {ui.whatsapp}
      <span className="sr-only">({ui.newTab})</span>
    </a>
  );
}

/** Confirmed phone / e-mail / WhatsApp, as a compact mono line (home S6, footer). */
export function ContactLine({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2 text-sm", className)}>
      <li>
        <a
          className={cn(
            "inline-flex min-h-11 items-center underline-offset-4 hover:underline",
            eventClasses("phone_click"),
          )}
          href={`tel:${site.phone.e164}`}
        >
          {site.phone.display}
        </a>
      </li>
      <li>
        <a
          className={cn(
            "inline-flex min-h-11 items-center underline-offset-4 hover:underline",
            eventClasses("email_click"),
          )}
          href={`mailto:${site.email}`}
        >
          {site.email}
        </a>
      </li>
      {site.whatsapp && (
        <li>
          <a
            className={cn(
              "inline-flex min-h-11 items-center underline-offset-4 hover:underline",
              eventClasses("whatsapp_click", { page: "contact-line" }),
            )}
            href={whatsappHref(site.whatsapp, "")}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp<span className="sr-only"> ({ui.newTab})</span>
          </a>
        </li>
      )}
    </ul>
  );
}
