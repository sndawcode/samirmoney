"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/types";
import { frTypo } from "@/lib/fr-typography";

/** Radix accordion; the FAQPage JSON-LD is rendered by the page (§7, §12). */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <Accordion.Root
      type="multiple"
      className="divide-y divide-ink-950/10 border-y border-ink-950/10"
    >
      {items.map((item, i) => (
        <Accordion.Item key={item.question} value={`q${i}`}>
          <Accordion.Header asChild>
            <h3>
              <Accordion.Trigger className="group flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left text-lg font-extrabold tracking-tight">
                {frTypo(item.question)}
                <Plus
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-5 shrink-0 transition-transform duration-(--dur-ui) group-data-[state=open]:rotate-45"
                />
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          <Accordion.Content className="pb-5 text-graphite">
            <p className="max-w-[68ch]">{frTypo(item.answer)}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
