SU Needle Matcher v1.05 — offline PWA package (unprotected)

CONTENTS
- SU_Needle_Matcher_v1.05.html  (full app, PWA hooks already applied)
- manifest.webmanifest
- sw.js
- icon-192.png, icon-512.png, apple-touch-icon.png, favicon-32.png
- index.html

GITHUB PAGES
1. Upload ALL files to the root of repo su-needle-pwa (or replace existing).
2. If you rename the HTML after protecting it, update:
   - manifest.webmanifest → start_url
   - sw.js → ASSETS list
   - index.html → redirect target
3. Pages: Settings → Pages → Deploy from branch main / (root).
4. Open in Chrome/Safari:
   https://BazClassic.github.io/su-needle-pwa/SU_Needle_Matcher_v1.05.html
5. First load online → Install / Add to Home Screen → then works offline.

PROTECTION
You can re-apply your outer protection layer to the HTML after download.
After renaming (e.g. to …-protected.html), update start_url and sw.js asset list to match.
