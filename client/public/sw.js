self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Keep requests network-first so the install shell never serves stale prompts or account data.
self.addEventListener("fetch", () => {});
