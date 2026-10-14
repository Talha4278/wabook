-- WaBook: bookings, customers, services, reminder queue (per-owner via businesses.user_id)

create table if not exists businesses (
  id serial primary key,
  user_id text not null unique,
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Karachi',
  buffer_minutes integer not null default 15,
  max_per_slot integer not null default 1,
  hours jsonb not null default '[]'::jsonb,
  remind_24h boolean not null default true,
  remind_2h boolean not null default true,
  remind_morning boolean not null default false,
  template_en text not null default '',
  template_ur text not null default '',
  lang text not null default 'en',
  created_at timestamptz not null default now()
);
create index if not exists businesses_user_id_idx on businesses (user_id);
create index if not exists businesses_slug_idx on businesses (slug);

create table if not exists staff (
  id serial primary key,
  business_id integer not null references businesses(id) on delete cascade,
  name text not null
);
create index if not exists staff_business_id_idx on staff (business_id);

create table if not exists services (
  id serial primary key,
  business_id integer not null references businesses(id) on delete cascade,
  name text not null,
  duration_min integer not null,
  price_pkr integer not null
);
create index if not exists services_business_id_idx on services (business_id);

create table if not exists customers (
  id serial primary key,
  business_id integer not null references businesses(id) on delete cascade,
  name text not null,
  phone text not null
);
create unique index if not exists customers_business_phone_idx on customers (business_id, phone);

create table if not exists bookings (
  id serial primary key,
  business_id integer not null references businesses(id) on delete cascade,
  customer_id integer not null references customers(id) on delete cascade,
  service_id integer not null references services(id) on delete restrict,
  staff_id integer not null references staff(id) on delete restrict,
  starts_at timestamptz not null,
  status text not null default 'pending',
  source text not null default 'dashboard',
  created_at timestamptz not null default now()
);
create index if not exists bookings_business_starts_idx on bookings (business_id, starts_at);
create index if not exists bookings_status_idx on bookings (business_id, status);

create table if not exists reminder_jobs (
  id serial primary key,
  business_id integer not null references businesses(id) on delete cascade,
  booking_id integer not null references bookings(id) on delete cascade,
  kind text not null,
  send_at timestamptz not null,
  status text not null default 'queued',
  body text not null,
  sent_at timestamptz,
  error text
);
create index if not exists reminder_jobs_due_idx on reminder_jobs (status, send_at);

create table if not exists wa_messages (
  id serial primary key,
  business_id integer not null references businesses(id) on delete cascade,
  customer_id integer,
  booking_id integer,
  direction text not null,
  body text not null,
  simulated boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists wa_messages_business_idx on wa_messages (business_id, created_at desc);
