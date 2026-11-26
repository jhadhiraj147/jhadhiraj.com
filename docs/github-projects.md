# Automatic GitHub projects

The Projects output retains the three selected project summaries in `lib/data.ts`
and shows the six most recently pushed public repositories owned by `jhadhiraj147`.
Forks, archived/disabled repositories, and the profile README repository are excluded.
Each repository links to GitHub and shows its current description, primary language,
star/fork counts and latest push date. The legacy section also displays topics.

The browser fetches `/api/github/projects` on page load and every hour while the
page is visible. Returning to a tab after an hour also refreshes immediately.
Browser expiry is measured from the server's `fetchedAt`, not response arrival.
Stale snapshots retry after a shared 15-second window so server revalidation does
not add another full hour of browser caching. Transient browser failures back off
from 30 seconds to five minutes, shared across repeated outputs.
Successful GitHub results are cached on the server for one hour;
a stale cached result may be served while revalidation runs. No rebuild is needed
when a repository changes. An initial API failure leaves the selected builds visible;
a later failure preserves the repositories already displayed. GitHub errors are
returned as a generic 503 with `Cache-Control: no-store` and no credentials.
Concurrent cache misses share one server request. Failed upstream calls trigger
a private cooldown starting at 30 seconds and doubling on repeated failures up to
five minutes. Rate-limit responses without hints wait at least one minute. Valid
`Retry-After` hints and `X-RateLimit-Reset` when remaining quota is zero are honored,
bounded between one second and one hour. Failed JSON validation and timeouts also
cool down instead of repeatedly consuming quota.
Replacing the optional token clears this cooldown immediately. This coordination
is per running server instance; it does not replace the hourly shared data cache.

No token is required for public repositories. For more API quota on production,
set the optional **server-only** `GITHUB_TOKEN` environment variable in Vercel
(or `.env.local` for local development). Do not use a `NEXT_PUBLIC_` prefix or
commit the token. The public-repository endpoint does not need private repository
access; use a token with public metadata access only.

Implementation: `app/api/github/projects/route.ts`, `lib/github-client.ts`, `lib/github-projects.ts`, and
`components/terminal/TerminalOutput.tsx`. Repeated project outputs share browser
requests and cached responses. URLs are restricted to this owner's repository
paths, and malformed dates, IDs, counts, and duplicate repositories are rejected
or normalized before display. Change the account in `GITHUB_USERNAME` and the
profile link in `lib/data.ts` together if needed.

Verification (Node 22.18+):

```sh
node --experimental-strip-types --test tests/github-*.test.mjs
npx tsc --noEmit
```

References: [GitHub's public user repositories endpoint](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)
and [REST API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).
