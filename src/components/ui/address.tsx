import { Fragment } from "react";
import { site } from "@/content/fr/site";
import { frTypo } from "@/lib/fr-typography";

/** Renders French ordinals such as "6e" with a superscript suffix (§4.4). */
export function Ordinals({ text }: { text: string }) {
  const parts = frTypo(text).split(/(\d+)(e|er|re)\b/);
  return (
    <>
      {parts.map((part, i) => {
        // split() yields [text, number, suffix, text, …]
        if (i % 3 === 2) return <sup key={i}>{part}</sup>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function Address({ className }: { className?: string }) {
  const { street, district, city, country } = site.address;
  return (
    <address className={className} style={{ fontStyle: "normal" }}>
      <Ordinals text={street} />
      <br />
      {district}, {city}, {country}
    </address>
  );
}
