# PWA icons

The build uses **`vite-plugin-pwa`** with a manifest icon entry pointing at **`icon.svg`**.

For stronger install UX on all platforms, add **192×192** and **512×512** PNGs and register them in `vite.config.ts` under `VitePWA({ manifest: { icons: [...] } })`.
