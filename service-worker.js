importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute (
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
    // new workbox.strategies.NetworkFirst()
);




const cacheName = 'media';
const channelName = 'messages';
const fadeConfig = {duration: 200};
const urlPrefix = '/_media/';

const broadcastChannel = 'BroadcastChannel' in self ? new BroadcastChannel(channelName) : null;

const shareTargetHandler = async ({event}) => {
    if (broadcastChannel) {
        broadcastChannel.postMessage('Saving media locally...');
    }

    const formData = await event.request.formData();
    const mediaFiles = formData.getAll('media');
    const cache = await caches.open(cacheName);

    for (const mediaFile of mediaFiles) {
    // TODO: Instead of bailing, come up with a
    // default name for each possible MIME type.
        if (!mediaFile.name) {
            if (broadcastChannel) {
                broadcastChannel.postMessage('Sorry! No name found on incoming media.');
            }
            continue;
        }
        await cache.put(
            // TODO: Handle scenarios in which mediaFile.name isn't set,
            // or doesn't include a proper extension.
            `${urlPrefix}${Date.now()}-${mediaFile.name}`,
            new Response(mediaFile, {
                headers: {
                    'content-length': mediaFile.size,
                    'content-type': mediaFile.type,
                },
            })
        );
    }

  // Use the MIME type of the first file shared to determine where we redirect.
    const routeToRedirectTo = [
        audioRoute,
        imagesRoute,
        videosRoute,
    ].find((route) => mediaFiles[0].type.startsWith(route.mimePrefix));

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