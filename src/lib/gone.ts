/** 410 Gone for the retired WordPress endpoints (§8.4): tells crawlers and bots they will not return. */
export function gone(): Response {
  return new Response("Gone", {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
