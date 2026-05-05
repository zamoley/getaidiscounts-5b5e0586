
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now()
);
create unique index newsletter_subscribers_email_key on public.newsletter_subscribers (lower(email));
alter table public.newsletter_subscribers enable row level security;
create policy "anyone can subscribe"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (
    email is not null
    and char_length(email) between 3 and 255
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

create table public.deal_requests (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null,
  notes text,
  email text,
  created_at timestamptz not null default now()
);
alter table public.deal_requests enable row level security;
create policy "anyone can request a deal"
  on public.deal_requests for insert
  to anon, authenticated
  with check (
    char_length(tool_name) between 1 and 120
    and (notes is null or char_length(notes) <= 1000)
    and (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  );
