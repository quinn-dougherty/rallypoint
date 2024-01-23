# Bounties platform (working title)

Lean and quick funding by crowds or individuals for well-scoped items. Some dominance assurance contract / beeminder-like mechanisms a little later. I think of it like a "reverse manifund"

# Development

```console
$ cat .env
# Update these with your Supabase details from your project settings > API
# https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=<ask quinn>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ask quinn>
$ pnpm dev
```

Test data (currently) is logged in supabase console.

The deploy is concerned about typescript things that `npm run dev` won't notice, so it's good to also have an `npm run typewatch` terminal open alongside dev server.

#### Warning: running `npm run build` while an `npm run dev` is open will make weird things happen with bad error messages

All you need to do is kill `npm run dev` and restart it.

## When you modify table schema in supabase

```console
$ ./node_modules/.bin/supabase login # token in browser
$ pnpm gen-types
```

this will write `types/supabase.ts` with the table schema interface, it's problematic if it gets too outdated.
