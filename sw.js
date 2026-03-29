tent is user-generated and unverified.
1
var CACHE_NAME = "hotel-repair-v1";
var URLS_TO_CACHE = [
  "/Hotel/",
  "/Hotel/index.html"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  // Firebase запити — завжди з мережі
  if(event.request.url.indexOf("firebase") !== -1 ||
     event.request.url.indexOf("googleapis") !== -1 ||
     event.request.url.indexOf("gstatic") !== -1) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
