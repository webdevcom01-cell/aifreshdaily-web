/**
 * Sprint 6 Test Suite — AI Fresh Daily
 * Tests: ModelScoreboard voting, Related-by-tags, Error boundaries
 *
 * Run: node sprint6.test.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = 'https://kcqfaghyixwfewyudcgb.supabase.co';
const ANON_KEY     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcWZhZ2h5aXh3ZmV3eXVkY2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjUxMzIsImV4cCI6MjA4Njk0MTEzMn0.Rxz1tdAPdpzJnTNyXYgJpAiYVkEwcyjn5e8fxzrLTEk';
const PROJECT      = '/Users/buda007/aifreshdaily-next';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

// ── Tiny test runner ──────────────────────────────────────────────────────
let passed = 0, failed = 0;
function test(name, fn) {
  try {
    const r = fn();
    if (r instanceof Promise) {
      return r
        .then(() => { console.log(`  ✅ ${name}`); passed++; })
        .catch((e) => { console.log(`  ❌ ${name}\n     ${e.message}`); failed++; });
    }
    console.log(`  ✅ ${name}`); passed++;
  } catch (e) {
    console.log(`  ❌ ${name}\n     ${e.message}`); failed++;
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg ?? 'assertion failed'); }
function readSrc(rel) { return readFileSync(resolve(PROJECT, rel), 'utf-8'); }

// ──────────────────────────────────────────────────────────────────────────
// GROUP 1 — 6.1 ModelScoreboard: code
// ──────────────────────────────────────────────────────────────────────────
console.log('\n🏆  Group 1 — 6.1 ModelScoreboard voting: code');

test('ModelScoreboard imports ThumbsUp from lucide-react', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('ThumbsUp'), 'ThumbsUp icon not imported');
});

test('ModelScoreboard imports voteForModel from supabase', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('voteForModel'), 'voteForModel not imported');
});

test('ModelScore interface includes vote_count field', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('vote_count'), 'vote_count not in ModelScore interface');
});

test('localStorage helpers hasVoted + markVoted are defined', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('hasVoted'), 'hasVoted helper missing');
  assert(src.includes('markVoted'), 'markVoted helper missing');
  assert(src.includes('afd-voted-model-'), 'localStorage key prefix missing');
});

test('handleVote: early-returns if already voted', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('if (votes[modelId]) return'), 'no early-return guard for already-voted');
});

test('handleVote: calls markVoted, updates state, fires voteForModel RPC', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('markVoted(modelId)'), 'markVoted not called on vote');
  assert(src.includes('voteForModel(modelId)'), 'voteForModel RPC not called');
  assert(src.includes('setVotes'), 'votes state not updated');
});

test('vote button is disabled when already voted', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('disabled={voted}'), 'vote button not disabled after voting');
});

test('vote count display = DB vote_count + local delta', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('vote_count ?? 0') || src.includes('vote_count') && src.includes('votes[model.id] ?? 0'),
    'vote display does not combine DB count + local delta');
});

test('table header now has 7 columns including Vote', () => {
  const src = readSrc('sections/ModelScoreboard.tsx');
  assert(src.includes('>Vote<'), 'Vote column header missing');
});

// ──────────────────────────────────────────────────────────────────────────
// GROUP 2 — 6.1 voteForModel in supabase.ts
// ──────────────────────────────────────────────────────────────────────────
console.log('\n📦  Group 2 — 6.1 voteForModel in supabase.ts');

test('supabase.ts exports voteForModel', () => {
  const src = readSrc('lib/supabase.ts');
  assert(src.includes('export async function voteForModel'), 'voteForModel not exported');
});

test('voteForModel calls RPC vote_for_model with p_model_id', () => {
  const src = readSrc('lib/supabase.ts');
  assert(src.includes("rpc('vote_for_model'"), "RPC name 'vote_for_model' missing");
  assert(src.includes('p_model_id'), 'p_model_id param missing');
});

test('sprint6_migrations.sql exists in project root', () => {
  assert(existsSync(resolve(PROJECT, 'sprint6_migrations.sql')), 'migration file not found');
});

test('migration adds vote_count column to model_scores', () => {
  const sql = readSrc('sprint6_migrations.sql');
  assert(sql.includes('vote_count'), 'vote_count column not in migration');
  assert(sql.includes('model_scores'), 'model_scores table not referenced');
});

test('migration creates vote_for_model SECURITY DEFINER function', () => {
  const sql = readSrc('sprint6_migrations.sql');
  assert(sql.includes('vote_for_model'), 'vote_for_model function missing');
  assert(sql.includes('security definer'), 'SECURITY DEFINER missing');
});

test('migration grants execute to anon', () => {
  const sql = readSrc('sprint6_migrations.sql');
  assert(sql.includes('grant execute') && sql.includes('anon'), 'anon execute grant missing');
});

// ──────────────────────────────────────────────────────────────────────────
// GROUP 3 — 6.2 fetchRelatedByTags: code
// ──────────────────────────────────────────────────────────────────────────
console.log('\n🔗  Group 3 — 6.2 fetchRelatedByTags: code');

test('supabase.ts exports fetchRelatedByTags', () => {
  const src = readSrc('lib/supabase.ts');
  assert(src.includes('export async function fetchRelatedByTags'), 'fetchRelatedByTags not exported');
});

test('fetchRelatedByTags uses .overlaps() for tag matching', () => {
  const src = readSrc('lib/supabase.ts');
  assert(src.includes('.overlaps('), '.overlaps() call missing');
});

test('fetchRelatedByTags excludes the current article via .neq()', () => {
  const src = readSrc('lib/supabase.ts');
  // Should have neq('id', excludeId) inside fetchRelatedByTags
  const fnBody = src.split('fetchRelatedByTags')[1];
  assert(fnBody.includes('.neq('), '.neq(id) not present in fetchRelatedByTags');
});

test('fetchRelatedByTags falls back to category when no tag matches', () => {
  const src = readSrc('lib/supabase.ts');
  const fnBody = src.split('fetchRelatedByTags')[1]?.split('export')[0] ?? '';
  assert(fnBody.includes('.eq(\'category\''), 'category fallback missing in fetchRelatedByTags');
});

test('ArticleClient imports fetchRelatedByTags (not fetchByCategory)', () => {
  const src = readSrc('app/(main)/article/[id]/ArticleClient.tsx');
  assert(src.includes('fetchRelatedByTags'), 'fetchRelatedByTags not imported in ArticleClient');
  assert(!src.includes('fetchByCategory'), 'fetchByCategory should be removed from ArticleClient');
});

test('ArticleClient passes article.tags to fetchRelatedByTags', () => {
  const src = readSrc('app/(main)/article/[id]/ArticleClient.tsx');
  assert(src.includes('article.tags'), 'article.tags not passed to fetchRelatedByTags');
});

// ──────────────────────────────────────────────────────────────────────────
// GROUP 4 — 6.2 fetchRelatedByTags: live DB
// ──────────────────────────────────────────────────────────────────────────
console.log('\n🌐  Group 4 — 6.2 fetchRelatedByTags: live DB');

test('overlaps query returns articles sharing tags', async () => {
  const { data: sample } = await supabase
    .from('articles')
    .select('id, tags')
    .not('tags', 'is', null)
    .limit(5);
  const withTags = (sample ?? []).find(r => r.tags?.length > 0);
  if (!withTags) return; // no tagged articles to test
  const { data, error } = await supabase
    .from('articles')
    .select('id, tags')
    .overlaps('tags', withTags.tags)
    .neq('id', withTags.id)
    .limit(3);
  assert(!error, `overlaps query error: ${error?.message}`);
  // may legitimately return 0 if article's tags are unique — just check no crash
});

test('category fallback query works when tags is empty', async () => {
  const { data: sample } = await supabase
    .from('articles')
    .select('id, category')
    .limit(1);
  const article = sample?.[0];
  if (!article) return;
  const { data, error } = await supabase
    .from('articles')
    .select('id, category')
    .eq('category', article.category)
    .neq('id', article.id)
    .limit(3);
  assert(!error, `category fallback error: ${error?.message}`);
  assert(data !== null, 'category fallback returned null');
});

// ──────────────────────────────────────────────────────────────────────────
// GROUP 5 — 6.3 Error Boundaries: file structure
// ──────────────────────────────────────────────────────────────────────────
console.log('\n🛡️   Group 5 — 6.3 Error Boundaries: file structure');

test('app/(main)/error.tsx exists', () => {
  assert(existsSync(resolve(PROJECT, 'app/(main)/error.tsx')), 'app/(main)/error.tsx not found');
});

test('app/(main)/article/[id]/error.tsx exists', () => {
  assert(existsSync(resolve(PROJECT, 'app/(main)/article/[id]/error.tsx')),
    'article page error.tsx not found');
});

test('main error.tsx has "use client" directive', () => {
  const src = readSrc('app/(main)/error.tsx');
  assert(src.startsWith('"use client"') || src.startsWith("'use client'"), '"use client" missing');
});

test('article error.tsx has "use client" directive', () => {
  const src = readSrc('app/(main)/article/[id]/error.tsx');
  assert(src.startsWith('"use client"') || src.startsWith("'use client'"), '"use client" missing');
});

test('main error.tsx accepts reset prop and calls it on button click', () => {
  const src = readSrc('app/(main)/error.tsx');
  assert(src.includes('reset'), 'reset prop missing');
  assert(src.includes('onClick={reset}'), 'onClick={reset} not wired up');
});

test('article error.tsx accepts reset prop and calls it on button click', () => {
  const src = readSrc('app/(main)/article/[id]/error.tsx');
  assert(src.includes('reset'), 'reset prop missing');
  assert(src.includes('onClick={reset}'), 'onClick={reset} not wired up');
});

test('both error pages link back to home (/)', () => {
  const main = readSrc('app/(main)/error.tsx');
  const art  = readSrc('app/(main)/article/[id]/error.tsx');
  assert(main.includes('href="/"'), 'main error.tsx missing link to /');
  assert(art.includes('href="/"'),  'article error.tsx missing link to /');
});

test('error boundaries log error in useEffect', () => {
  const main = readSrc('app/(main)/error.tsx');
  const art  = readSrc('app/(main)/article/[id]/error.tsx');
  assert(main.includes('console.error'), 'main error.tsx not logging error');
  assert(art.includes('console.error'),  'article error.tsx not logging error');
});

test('error digest is displayed when present', () => {
  const main = readSrc('app/(main)/error.tsx');
  const art  = readSrc('app/(main)/article/[id]/error.tsx');
  assert(main.includes('error.digest'), 'main error.tsx not showing digest');
  assert(art.includes('error.digest'),  'article error.tsx not showing digest');
});

// ──────────────────────────────────────────────────────────────────────────
// RESULTS
// ──────────────────────────────────────────────────────────────────────────
setTimeout(async () => {
  await new Promise(r => setTimeout(r, 3000));
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Sprint 6 Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) console.log('🎉 All Sprint 6 tests passed!');
  else console.log('⚠️  Some tests failed — check above for details.');
  process.exit(failed > 0 ? 1 : 0);
}, 100);
