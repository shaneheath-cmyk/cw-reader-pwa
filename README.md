# CW Reader PWA

Progressive Web App for Collective Writings subscribers.

- **URL:** app.collectivewritings.com.au
- **Stack:** Next.js 14, Tailwind CSS, epub.js
- **Auth:** Shared with CW Library backend (read.collectivewritings.com.au/api)
- **Storage:** Backblaze B2 via signed URLs

## Features
- Install to iOS/Android home screen (PWA)
- In-app epub rendering (epub.js)
- Built-in audiobook player (HTML5 + custom UI)
- CTS design palette (Obsidian/Aurum/Ecru)

## Deploy
1. Push to GitHub
2. Import to Vercel
3. Set env: `NEXT_PUBLIC_CW_API_URL=https://read.collectivewritings.com.au/api`
4. Add domain: `app.collectivewritings.com.au`
5. Add CNAME in VentraIP: `app` → `cname.vercel-dns.com`
