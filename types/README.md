## When you modify table schema in supabase

```bash
$ ./node_modules/.bin/supabase login # token in browser
$ npm run gen-types
```

this will write `types/supabase.ts` with the table schema interface, it's problematic if it gets too outdated. Do not manually edit `types/supabase.ts`
