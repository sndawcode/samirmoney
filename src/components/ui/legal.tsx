import type { ReactNode } from "react";
import type { LegalBlock } from "@/content/fr/legal";
import { frTypo } from "@/lib/fr-typography";
import { Container, Section } from "@/components/ui/section";

/** Reading layout for legal pages (max 72ch, §9.9). */
export function LegalPage({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <Section
      theme="paper"
      spacing="none"
      className="pt-[calc(var(--header-h)+3rem)] pb-(--section-y) lg:pt-[calc(var(--header-h)+5rem)]"
    >
      <Container>
        <article className="mx-auto flex max-w-[72ch] flex-col gap-6">
          <header className="flex flex-col gap-3 border-b border-ink-950/10 pb-8">
            <h1 className="text-h2">{frTypo(title)}</h1>
            {meta && <p className="text-sm text-graphite">{frTypo(meta)}</p>}
          </header>
          {children}
        </article>
      </Container>
    </Section>
  );
}

export function LegalBlocks({ blocks }: { blocks: readonly LegalBlock[] }) {
  return (
    <div className="flex flex-col gap-4 text-body [&_h2]:mt-8 [&_h2]:text-h3 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-extrabold [&_h4]:font-extrabold">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "ul":
            return (
              <ul key={i} className="flex list-disc flex-col gap-2 pl-6">
                {block.items.map((item) => (
                  <li key={item}>{frTypo(item)}</li>
                ))}
              </ul>
            );
          case "h2":
            return <h2 key={i}>{frTypo(block.text)}</h2>;
          case "h3":
            return <h3 key={i}>{frTypo(block.text)}</h3>;
          case "h4":
            return <h4 key={i}>{frTypo(block.text)}</h4>;
          default:
            return <p key={i}>{frTypo(block.text)}</p>;
        }
      })}
    </div>
  );
}
