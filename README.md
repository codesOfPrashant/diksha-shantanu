# Diksha & Shantanu — Wedding Invitation

A frontend-only Next.js wedding invitation for **Diksha & Shantanu** (22 November 2026, Roorkee, Uttarakhand).

Inspired by invitation experiences like [Chhaya & Ankit](https://chhaya-weds-ankit.vercel.app/v2).

## Features

- Seal screen → full invitation reveal
- Background music with a clickable playlist
- Couple photos, countdown, venue directions
- Multi-step RSVP that writes to your Google Sheet (via Apps Script)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connect RSVP to Google Sheets

The sheet you shared:

https://docs.google.com/spreadsheets/d/1oPvghB__FEtzq_E935PuHnLgfxoHlPsVyxBFAQMxlug/edit

1. Open the sheet → **Extensions → Apps Script**
2. Paste the contents of `google-apps-script/Code.gs`
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the web app URL into `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
```

5. Restart `npm run dev`

RSVP columns written: Timestamp, Name, Phone, Attending, Guests, Message, Submitted At (ISO).

## Assets

- Photos: `public/photos/` (web-optimized copies in `public/photos/web/`)
- Music: `public/music/`

## Deploy

Any static-friendly Next host works (Vercel recommended). Set `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` in the host environment variables.
