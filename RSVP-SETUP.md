# Google Sheets RSVP — 5-minute setup

1. Go to https://sheets.new and name the sheet "Devankshi RSVPs".
2. Menu: Extensions → Apps Script. Delete the sample code, paste everything from `Code.gs`, press Save (💾).
3. Top-right: Deploy → New deployment → gear icon → "Web app".
   - Description: RSVP
   - Execute as: **Me**
   - Who has access: **Anyone**
   → Deploy. Authorize when asked (Advanced → Go to project → Allow).
4. Copy the Web app URL (ends in `/exec`).
5. Open `index.html`, find `const RSVP_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'` and paste the URL inside the quotes.
6. Upload the HTML to GitHub Pages / Vercel as before.

Test: open the page, submit an RSVP — a sheet tab "RSVPs" appears with the row, and you get an email
(set `NOTIFY_EMAIL = ''` in Code.gs to turn emails off).

Notes
- Same name replying again updates their row (no duplicates).
- Free forever; Apps Script quota is ~20,000 requests/day.
- If you edit Code.gs later: Deploy → Manage deployments → ✏️ → Version: New → Deploy (URL stays the same).

# Deploy to Vercel (free)
Option A — drag & drop: go to https://vercel.com/new, drop this folder (index.html + vercel.json). Done.
Option B — CLI:  npm i -g vercel  →  cd into this folder  →  vercel --prod
Your link will be https://<project-name>.vercel.app — share it on WhatsApp.
