-- Clinic onboarding + WhatsApp credentials per shop + service categories

alter table businesses add column if not exists onboarded boolean not null default false;
alter table businesses add column if not exists wa_token text not null default '';
alter table businesses add column if not exists wa_phone_id text not null default '';

alter table services add column if not exists category text not null default 'General';
create index if not exists services_category_idx on services (business_id, category);
