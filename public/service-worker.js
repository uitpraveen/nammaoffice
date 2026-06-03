/*
 * Self-destructing service worker.
 *
 * Purpose: cleanly remove any legacy service worker that a previous version
 * of this domain (the old Wix site) may have registered, and purge its
 * caches — so returning visitors get the current site instead of a stale,
 * SW-cached copy.
 *
 * How it works: when a browser that still has the old worker registered does
 * its periodic update check, it fetches this script from the same URL, sees
 * new bytes, installs it, and on activate this worker deletes all caches,
 * unregisters itself, and reloads any open tabs from the network.
 *
 * The current site does NOT use a service worker, so this file never gets
 * registered by new visitors — it only ever runs to evict an old one. Safe
 * to keep indefinitely; can be removed once legacy workers have cleared.
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
