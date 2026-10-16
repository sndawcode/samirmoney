import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type DeviceFrameProps = {
  kind: "phone" | "browser" | "terminal";
  children: ReactNode;
  className?: string;
};

/** Generic CSS device frames for real screenshots — deliberately not an imitation of any brand's hardware (§5.4). */
export function DeviceFrame({ kind, children, className }: DeviceFrameProps) {
  if (kind === "browser") {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-ink-950/10 bg-paper shadow-2xl shadow-ink-950/20 ink:border-white/10",
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="flex h-7 items-center gap-1.5 border-b border-ink-950/10 bg-mist px-3"
        >
          <span className="size-2 rounded-full bg-ink-950/15" />
          <span className="size-2 rounded-full bg-ink-950/15" />
          <span className="size-2 rounded-full bg-ink-950/15" />
          <span className="ml-3 h-3 flex-1 rounded-full bg-ink-950/5" />
        </div>
        <div className="relative">{children}</div>
      </div>
    );
  }
  if (kind === "terminal") {
    return (
      <div
        className={cn(
          "rounded-[28px] bg-ink-800 p-3 pb-10 shadow-2xl ring-1 shadow-ink-950/40 ring-white/10",
          className,
        )}
      >
        <div className="overflow-hidden rounded-[18px] bg-ink-950">{children}</div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "rounded-[34px] bg-ink-900 p-2 shadow-2xl ring-1 shadow-ink-950/30 ring-white/15",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[26px] bg-paper">{children}</div>
    </div>
  );
}
