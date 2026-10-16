import "server-only";

type Level = "info" | "warn" | "error";

/** Structured one-line JSON logs. Never pass message bodies, names, e-mails or phone numbers (§15). */
export function log(
  level: Level,
  event: string,
  fields: Record<string, string | number | boolean | undefined> = {},
) {
  const line = JSON.stringify({ level, event, time: new Date().toISOString(), ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
