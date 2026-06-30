# Supabase setup

1. Copy .env.example to .env.local and fill in your Supabase values.
2. Run the SQL from supabase/migrations/001_initial_schema.sql in the Supabase SQL Editor.
3. Run:

```bash
npm run supabase:seed
```

This creates or updates the admin user in the admin_users table.
