self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('magic-canvas-v1').then((cache) => {
            return cache.addAll([
                '/MAGIA-IN-CORSIA/',
                '/MAGIA-IN-CORSIA/index.html',
                '/MAGIA-IN-CORSIA/style.css',
                '/MAGIA-IN-CORSIA/app.js',
                '/MAGIA-IN-CORSIA/manifest.json'
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
