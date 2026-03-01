## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`

2. Set ENVs

Set the GEMINI_API_KEY in .env.local to your Gemini API key.
Set the TELEGRAM_BOT_TOKEN in .env.local to your Telegram Bot token.
Set the TELEGRAM_CHAT_ID in .env.local to your personal Telegram Chat ID.
Set the VITE_TURNSTILE_SITE_KEY in .env.local to your Cloudflare Turnstile Site Key (Frontend).
Set the TURNSTILE_SECRET_KEY in .env.local to your Cloudflare Turnstile Secret Key (Backend).
Set the ADMIN_SECRET_KEY in .env.local to your chosen secure admin password.
Set the BLOB_READ_WRITE_TOKEN in .env.local to your Vercel Blob storage token.
Set the POSTGRES_URL in .env.local to your PostgreSQL database connection string.

3. Run the app:
   `npm run dev`
