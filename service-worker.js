importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute (
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
    // new workbox.strategies.NetworkFirst()
);


const shareTargetHandler = async ({event}) => {
    if (broadcastChannel) {
        broadcastChannel.postMessage('Saving media locally...');
}

const formData = await event.request.formData();
const dialedNumber = formData.getAll('number');
const cache = await caches.open(cacheName);

for (const mediaFile of mediaFiles) {
    // TODO: Instead of bailing, come up with a
    // default name for each possible MIME type.
    if (!dialedNumber.name) {
    if (broadcastChannel) {
        broadcastChannel.postMessage('Sorry! No name found on incoming media.');
    }
    continue;
    }
    await cache.put(
    // TODO: Handle scenarios in which mediaFile.name isn't set,
    // or doesn't include a proper extension.
    `${urlPrefix}${Date.now()}-${dialedNumber.name}`,
    new Response(dialedNumber, {
        headers: {
        'content-length': dialedNumber.size,
        'content-type': dialedNumber.type,
        },
    })
    );
}

// Use the MIME type of the first file shared to determine where we redirect.
const routeToRedirectTo = [
    audioRoute,
    imagesRoute,
    videosRoute,
].find((route) => dialedNumber[0].type.startsWith(route.mimePrefix));

const redirectionUrl = routeToRedirectTo ? `/#${routeToRedirectTo.href}` : '/';

// After the POST succeeds, redirect to the main page.
return Response.redirect(redirectionUrl, 303);
};

const cachedMediaHandler = new CacheOnly({
cacheName,
plugins: [
    // Support for cache requests that include a Range: header.
    new RangeRequestsPlugin(),
],
});

skipWaiting();
clientsClaim();

// This will be replaced by the list of files to precache by
// the `workbox injectManifest` build step.
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
'/_share-target',
shareTargetHandler,
'POST'
);

registerRoute(
new RegExp(urlPrefix),
cachedMediaHandler
);