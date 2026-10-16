import { z } from "zod";

// Zod's JIT fast path compiles validators with `new Function`, which our CSP blocks (no 'unsafe-eval', §15.1).
z.config({ jitless: true });

export { z };
