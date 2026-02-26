# The Unfolding: Teams Edition

A digital facilitation experience for leaders preparing to transform team culture.

## Setup

1. Clone this repo
2. Run `npm install`
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://oxjaqsjurnrtsihnzpfl.supabase.co
   VITE_SUPABASE_ANON_KEY=your_publishable_key_here
   ```
4. Run `npm run dev` to start locally

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Database

Run this SQL in your Supabase SQL Editor:

```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  data jsonb not null default '{}',
  updated_at timestamp with time zone default now()
);

alter table sessions enable row level security;

create policy "Users can read own data" on sessions
  for select using (true);
create policy "Users can insert own data" on sessions
  for insert with check (true);
create policy "Users can update own data" on sessions
  for update using (true);
```
