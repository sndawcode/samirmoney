/** What a form server action returns to the client. */
export type FormResult =
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };
