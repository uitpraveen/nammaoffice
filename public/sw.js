/*
 * Self-destructing service worker (alias path).
 *
 * Identical to /service-worker.js — served here too because legacy workers
 * are sometimes registered at /sw.js. Removes any previously-registered
 * service worker and purges its caches so returning visitors get the live
 * site. The current site does not register a service worker.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch (e) {
        /* ignore */
      }
      try {
        const clients = await self.clients.matchAll({ type: "window" });
        clients.forEach((client) => client.navigate(client.url));
      } catch (e) {
        /* ignore */
      }
    })(),
  );
});
