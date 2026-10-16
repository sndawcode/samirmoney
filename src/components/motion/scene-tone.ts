/** Background of a mini-scene: the opposite of the surface it sits on. */
export type SceneTone = "mist" | "paper";
export const TONE_BG: Record<SceneTone, string> = { mist: "bg-mist", paper: "bg-paper" };
