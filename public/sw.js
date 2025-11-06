/* eslint-disable no-undef */
// Disable Workbox console logs
self.__WB_DISABLE_DEV_LOGS = true;

// Import workbox modules
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// Precache assets (manifest will be injected by VitePWA)
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request, url }) => {
    const isImage = request.destination === "image";
    const isRecipeImage =
      url.pathname.includes("/recipes/") && /\.(jpg|jpeg|webp)$/i.test(url.pathname);
    return isImage && isRecipeImage;
  },
  new CacheFirst({
    cacheName: "recipe-images-cache",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);
