self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('magic-canvas-v1').then((cache) => {
            return cache.addAll([
                '/magia-in-corsia/',
                '/magia-in-corsia/index.html',
                '/magia-in-corsia/style.css',
                '/magia-in-corsia/app.js',
                '/magia-in-corsia/manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
