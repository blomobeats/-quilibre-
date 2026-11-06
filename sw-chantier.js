/* Ancien service worker d'Aequo (avant son déplacement dans aequo/).
   Il se désinscrit et vide son cache : chaque dossier (aequo/, orion/) a maintenant le sien. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('chantier-') === 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.registration.unregister(); }));
});
