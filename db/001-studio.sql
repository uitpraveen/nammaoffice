CREATE TABLE IF NOT EXISTS studio_entries (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('logo','blog','news','case-study','testimonial')),
  owner_id text REFERENCES "user"(id) ON DELETE RESTRICT,
  draft jsonb NOT NULL,
  workflow text NOT NULL DEFAULT 'draft' CHECK (workflow IN ('draft','review','scheduled','published','archived')),
  version integer NOT NULL DEFAULT 1,
  published_revision uuid,
  scheduled_revision uuid,
  scheduled_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS studio_revisions (
  id uuid PRIMARY KEY,
  entry_id uuid NOT NULL REFERENCES studio_entries(id) ON DELETE RESTRICT,
  data jsonb NOT NULL,
  actor_id text REFERENCES "user"(id) ON DELETE SET NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS studio_revisions_entry ON studio_revisions(entry_id, created_at DESC);
CREATE INDEX IF NOT EXISTS studio_entries_kind ON studio_entries(kind, updated_at DESC);
CREATE INDEX IF NOT EXISTS studio_entries_schedule ON studio_entries(scheduled_at) WHERE scheduled_revision IS NOT NULL;
CREATE TABLE IF NOT EXISTS studio_slugs (
  kind text NOT NULL, slug text NOT NULL,
  entry_id uuid NOT NULL REFERENCES studio_entries(id) ON DELETE RESTRICT,
  PRIMARY KEY(kind, slug)
);
CREATE TABLE IF NOT EXISTS studio_media (
  id uuid PRIMARY KEY,
  owner_id text REFERENCES "user"(id) ON DELETE RESTRICT,
  filename text NOT NULL,
  mime text NOT NULL,
  bytes bigint NOT NULL,
  sha256 text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('logo','image')),
  options jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','ready','failed','trashed')),
  variants jsonb NOT NULL DEFAULT '{}',
  error text,
  version integer NOT NULL DEFAULT 1,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id,sha256,purpose,options)
);
CREATE TABLE IF NOT EXISTS studio_media_usage (
  entry_id uuid NOT NULL REFERENCES studio_entries(id) ON DELETE RESTRICT,
  media_id uuid NOT NULL REFERENCES studio_media(id) ON DELETE RESTRICT,
  scope text NOT NULL CHECK (scope IN ('draft','published','scheduled')),
  PRIMARY KEY(entry_id,media_id,scope)
);
CREATE INDEX IF NOT EXISTS studio_media_usage_lookup ON studio_media_usage(media_id,scope);
CREATE TABLE IF NOT EXISTS studio_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id text REFERENCES "user"(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_id text,
  detail jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS studio_meta (key text PRIMARY KEY, value jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS studio_limits (key text PRIMARY KEY, count integer NOT NULL, reset_at timestamptz NOT NULL);
