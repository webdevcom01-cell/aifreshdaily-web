-- ============================================================
-- Sprint 8 Migrations — AI Fresh Daily
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 8.1  Slug column for SEO-friendly URLs ─────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slugs for existing articles from headline
-- Uses: lowercase, keep alphanumeric and spaces, replace spaces with dashes
UPDATE articles
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(headline, '[^a-zA-Z0-9\s-]', '', 'g'),
      '[\s_]+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- Truncate slugs to 80 characters
UPDATE articles SET slug = LEFT(slug, 80) WHERE LENGTH(slug) > 80;

-- Remove leading/trailing dashes
UPDATE articles SET slug = TRIM(BOTH '-' FROM slug) WHERE slug IS NOT NULL;

-- Handle duplicate slugs by appending -2, -3, etc.
-- First, create a unique slug index (deferred)
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug) WHERE slug IS NOT NULL;

-- Verify
-- SELECT id, headline, slug FROM articles ORDER BY published_at DESC LIMIT 10;

-- ── 8.2  view_count column (idempotent) ──────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- ── 8.3  increment_view_count RPC ─────────────────────────
CREATE OR REPLACE FUNCTION increment_view_count(article_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE articles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = article_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_view_count(TEXT) TO anon, authenticated;

-- ── 8.4  share_count column and RPC ───────────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_share_count(article_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE articles
  SET share_count = COALESCE(share_count, 0) + 1
  WHERE id = article_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_share_count(TEXT) TO anon, authenticated;

-- ── 8.5  Performance indexes ──────────────────────────────
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_is_breaking ON articles(is_breaking) WHERE is_breaking = true;
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON articles(view_count DESC NULLS LAST);

-- ── 8.6  RLS policies (if not already set) ────────────────
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow all users to read articles
DROP POLICY IF EXISTS "Public read access" ON articles;
CREATE POLICY "Public read access" ON articles
  FOR SELECT USING (true);

-- Only service_role (pipeline) can insert/update/delete
DROP POLICY IF EXISTS "Service role write" ON articles;
CREATE POLICY "Service role write" ON articles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── Verify ────────────────────────────────────────────────
-- SELECT COUNT(*) FROM articles WHERE slug IS NOT NULL;
-- SELECT id, headline, slug, view_count, share_count FROM articles LIMIT 5;
