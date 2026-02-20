-- ============================================================
-- Sprint 6 Migrations — AI Fresh Daily
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 6.1  ModelScoreboard — vote_count column ──────────────
alter table model_scores
  add column if not exists vote_count int not null default 0;

-- Index for fast vote-count ordering
create index if not exists model_scores_vote_count_idx
  on model_scores (vote_count desc);

-- SECURITY DEFINER function so anon users can vote
-- (bypasses RLS without granting direct UPDATE access)
create or replace function vote_for_model(p_model_id int)
returns void
language plpgsql
security definer
as $$
begin
  update model_scores
  set    vote_count = vote_count + 1
  where  id = p_model_id;
end;
$$;

-- Grant execute to anonymous + authenticated callers
grant execute on function vote_for_model(int) to anon, authenticated;

-- ── Verify ────────────────────────────────────────────────
-- select id, name, vote_count from model_scores order by id;
-- select vote_for_model(1);   -- should return void, vote_count +1
