# Fitness App

Simple static fitness web app scaffold with Supabase authentication. Designed to be hosted on GitHub Pages.

## Features

- Login screen with email/password and magic link (passwordless)
- Supabase client setup via environment-like config file
- Basic auth state handling and dashboard placeholder

## Project Structure

```
.
├── index.html          # Login page
├── dashboard.html      # Authenticated placeholder page
├── styles.css          # Minimal styling
├── app.js              # App logic and Supabase auth
├── config.example.js   # Copy to config.js and fill in keys
└── README.md
```

## Setup

1. Create a Supabase project at `https://supabase.com`.
2. In your project, go to Project Settings → API and copy:
   - Project URL
   - anon public API key
3. In Authentication → Providers, enable Email provider. Optionally enable Magic Link.
4. In Authentication → Providers → Google, enable Google and add your OAuth Client (Google Cloud Console). For static hosting add redirect URI(s) like:
   - `http://localhost:8080/dashboard.html` (local)
   - `https://<username>.github.io/Fitness_App/dashboard.html` (GitHub Pages)
5. Copy `config.example.js` to `config.js` and fill in your values.

## Run locally

This is a static site. You can open `index.html` directly, or serve with a static server for local testing.

On Windows PowerShell (no install needed):

```
Start-Process http://localhost:8080; powershell -Command "cd $pwd; python -m http.server 8080"
```

Or with Node (if installed):

```
npx serve .
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub → Settings → Pages, set Source to `main` branch `/ (root)`.
3. Ensure `config.js` is committed with your public anon key and URL (safe for client-side use). The anon key is designed to be public. Apply Row Level Security in Supabase for your tables.
4. If using Google login, ensure the production redirect URI matches your Pages URL: `https://<username>.github.io/Fitness_App/dashboard.html`.

## Where to get keys

- Supabase Project URL and anon key: Project Settings → API
- Google OAuth client ID/secret: Google Cloud Console → APIs & Services → Credentials → OAuth client ID

## Notes

- Never commit service_role keys. Only use the anon public key on the client.
- For custom domains, configure in GitHub Pages settings.
