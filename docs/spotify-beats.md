# Spotify / Beats

The Beats section reads the portfolio owner's Spotify listening history after
the owner authorizes access. Until then, it shows an honest disconnected state.
It never invents tracks or listening counts.

## What the chart means

The server requests **one page of the 50 most recent plays**, filters those plays
from Monday at midnight in `America/Chicago` (Nashville), and ranks the five songs
with the most occurrences in that sample. Ties use the latest observed play.
The section explicitly calls this a snapshot, not a complete weekly chart.
Heavy listening can push earlier plays outside this sample.

Spotify's top-items endpoint has a short-term window of roughly four weeks,
so it cannot supply an exact calendar-week top chart. This implementation uses
recently played history rather than mislabeling four-week affinity as weekly
play counts. A complete weekly chart would require a separate persistent history
collector; this local integration does not claim to collect history in the background.

The data refreshes every five minutes while the page is visible and when a
stale hidden tab becomes visible. Successful server data is cached for five
minutes. A temporary failure retains the last displayed snapshot.
Concurrent server requests share one upstream snapshot request. An expired access
token is refreshed and retried once within a single 15-second deadline. Failures
have a short cooldown, and Spotify's `Retry-After` is respected on rate limits,
so repeated public requests cannot multiply failing upstream calls in one server
process. These safeguards do not replace a hosting provider's traffic controls
across independent server instances.

## Connect your account once

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   and create or use your own Web API app. Spotify currently requires an active
   Premium subscription for development-mode app owners.
2. In the app settings, add and save this exact redirect URI, keeping any existing
   production website URI:
   `http://127.0.0.1:4381/spotify/callback`. Spotify accepts HTTP for loopback IP
   addresses and does not accept `localhost` as a redirect URI.
3. Add your app credentials to the project's ignored `.env.local`:

   ```dotenv
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

4. From the project directory, run (Node 22.18+):

   ```sh
   node scripts/connect-spotify.mjs
   ```

5. Open the printed local setup page, `http://127.0.0.1:4381/`, on this computer.
   It links to the Spotify Developer Dashboard and displays the exact callback
   to add and save. Then click **connect your Spotify account**, sign in as the
   portfolio owner, and approve read access to recent listening history.
   If Spotify reports an invalid redirect URI, the callback has not been saved
   exactly as shown; return to the dashboard and add it before trying again.
   The helper listens only on `127.0.0.1:4381`, validates OAuth state, then saves
   `SPOTIFY_REFRESH_TOKEN` privately to `.env.local`. It never prints the token,
   and it preserves other environment settings with an atomic, private file
   replacement. It rejects foreign Host/Origin headers and malformed URLs.
   The helper stops after success,
   denial, or a ten-minute timeout.
6. Return to `http://localhost:3000`, refresh, and type `beats` at the prompt.
   Restart `npm run dev` if the connection has not appeared. The Beats view can
   then display these listening snapshots.

Do not paste secrets into chat or commit `.env.local`. If the app account needs
allowlisting in Spotify's development settings, add your own account there.
For Vercel later, copy the three `SPOTIFY_` values into server environment
settings with **no `NEXT_PUBLIC_` prefix**, then redeploy. The owner authorizes
once; website visitors do not sign in or change which account is displayed.

Spotify refresh tokens currently expire six months after authorization. Run the
connection helper again if authorization expires or is revoked. Access tokens
are refreshed server-side and never returned to the browser. If Spotify rotates
a refresh token, the running server retains its replacement in memory; reconnect
if an old deployment credential stops working after a restart.
After an `invalid_grant` or `invalid_client` response, the running reader stops
retrying that authorization. Reconnect or correct the credentials, then restart
the local server (or redeploy with updated server environment settings).

## Files and checks

- `components/sections/Beats.tsx`: plain-text, terminal-style listening rows.
- `app/api/spotify/beats/route.ts`: public, sanitized display data; no credentials.
- `lib/spotify-beats.ts`: Chicago week boundaries and bounded sample aggregation.
- `lib/spotify-client.ts`: server-only access-token refresh and history request.
- `scripts/connect-spotify.mjs`: local owner-only OAuth helper.

```sh
node --experimental-strip-types --test tests/spotify-beats.test.mjs
npx tsc --noEmit
node scripts/connect-spotify.mjs --help
```

## Official references

- [Recently played tracks](https://developer.spotify.com/documentation/web-api/reference/get-recently-played)
- [Top items and time ranges](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks)
- [Authorization Code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [Redirect URI requirements](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri)
- [Refreshing tokens and current expiration](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens)
- [Development-mode account requirements](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide)
