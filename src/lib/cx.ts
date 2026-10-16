// Class joining for client components: plain clsx, no tailwind-merge (keeps it out of the browser bundle, §13).
// Callers must not pass conflicting utilities — pick one class per property instead.
export { clsx as cx } from "clsx";
