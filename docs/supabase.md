# Supabase Setup

This project uses Supabase for authentication and storing game data. The `supabase/` directory holds the CLI configuration and SQL migrations.

## Initialize Supabase

1. Install the Supabase CLI and log in:

```bash
npm install -g supabase
supabase login
```

2. Link the repository to your Supabase project (or copy the `project_id` from `supabase/config.toml`):

```bash
supabase link --project-ref <project_id>
```

## Run Migrations

Apply the SQL files in `supabase/migrations` to your database:

```bash
supabase db push        # Apply migrations
# or start fresh
supabase db reset
```

## Generate the Client

Create typed database definitions and the Supabase client used in the app:

```bash
supabase gen types typescript --project-id <project_id> > src/integrations/supabase/types.ts
supabase gen client --project-id <project_id> --schema public > src/integrations/supabase/client.ts
```

Finally, set the following environment variables in a `.env` file:

```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Import the generated client in your React code:

```ts
import { supabase } from '@/integrations/supabase/client'
```
