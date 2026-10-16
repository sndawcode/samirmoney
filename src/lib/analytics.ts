// Plausible custom events (§11.4). Links are tracked with tagged-event classes (no client JS needed);
// client components call `track()` directly.

export type AnalyticsEvent =
  | "cta_click"
  | "product_tile_click"
  | "audience_filter"
  | "store_badge_click"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "docs_click"
  | "video_play"
  | "contact_submit"
  | "contact_error";

export type EventProps = Record<string, string>;

/** Plausible encodes spaces in tagged-event class values as "+". */
const encode = (value: string) => value.trim().replace(/\s+/g, "+");

/** Class names that make Plausible's tagged-events script record a click on this element. */
export function eventClasses(name: AnalyticsEvent, props: EventProps = {}): string {
  return [
    `plausible-event-name=${name}`,
    ...Object.entries(props).map(([key, value]) => `plausible-event-${key}=${encode(value)}`),
  ].join(" ");
}

type PlausibleFn = (event: string, options?: { props?: EventProps }) => void;

export function track(name: AnalyticsEvent, props?: EventProps): void {
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  plausible?.(name, props ? { props } : undefined);
}
