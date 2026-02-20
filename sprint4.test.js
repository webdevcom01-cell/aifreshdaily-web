/**
 * Sprint 4 — Verification Test Suite
 * Run: node sprint4.test.js
 * 35 tests across: DB state, code analysis, functional checks
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const URL = 'https://kcqfaghyixwfewyudcgb.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcWZhZ2h5aXh3ZmV3eXVkY2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjUxMzIsImV4cCI6MjA4Njk0MTEzMn0.Rxz1tdAPdpzJnTNyXYgJpAiYVkEwcyjn5e8fxzrLTEk';
const supabase = createClient(URL, KEY);

const ROOT = __dirname;
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

let passed = 0;
let failed = 0;
const failures = [];

function ok(name, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`);
    failed++;
    failures.push({ name, detail });
  }
}

// ─────────────────────────────────────────────────────────────
// GROUP 1 — DB: stock_tickers table (5 tests)
// ─────────────────────────────────────────────────────────────
async function testStockTickers() {
  console.log('\n📊 GROUP 1: stock_tickers table');
  const { data, error } = await supabase
    .from('stock_tickers')
    .select('*')
    .order('id');

  ok('T01 — table exists & readable', !error, error?.message);
  ok('T02 — exactly 9 rows seeded', data?.length === 9, `got ${data?.length}`);
  ok('T03 — all rows have valid type (stock|crypto|index)',
    data?.every(r => ['stock','crypto','index'].includes(r.type)),
    data?.filter(r => !['stock','crypto','index'].includes(r.type)).map(r => r.symbol).join(','));
  ok('T04 — NVDA row present', data?.some(r => r.symbol === 'NVDA'));
  ok('T05 — AI INDEX row has type="index"',
    data?.some(r => r.symbol === 'AI INDEX' && r.type === 'index'));
}

// ─────────────────────────────────────────────────────────────
// GROUP 2 — DB: view_count column (4 tests)
// ─────────────────────────────────────────────────────────────
async function testViewCount() {
  console.log('\n👁  GROUP 2: view_count column on articles');

  const { data: arts, error: e1 } = await supabase
    .from('articles')
    .select('id, view_count')
    .order('published_at', { ascending: false })
    .limit(3);

  ok('T06 — view_count column exists on articles', !e1, e1?.message);
  ok('T07 — view_count is numeric',
    arts?.every(a => typeof a.view_count === 'number'),
    arts?.map(a => `${a.id}:${typeof a.view_count}`).join(', '));

  const { data: sorted, error: e2 } = await supabase
    .from('articles')
    .select('id, view_count')
    .order('view_count', { ascending: false, nullsFirst: false })
    .limit(5);
  ok('T08 — ORDER BY view_count DESC works without error', !e2, e2?.message);

  const counts = sorted?.map(a => a.view_count) ?? [];
  const isSorted = counts.every((v, i) => i === 0 || v <= counts[i - 1]);
  ok('T09 — results correctly sorted DESC', isSorted, JSON.stringify(counts));
}

// ─────────────────────────────────────────────────────────────
// GROUP 3 — DB: increment_view_count RPC (3 tests)
// ─────────────────────────────────────────────────────────────
async function testIncrementRpc() {
  console.log('\n⚡ GROUP 3: increment_view_count RPC');

  const { data: pick } = await supabase
    .from('articles')
    .select('id, view_count')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  const artId  = pick?.id;
  const before = pick?.view_count ?? 0;

  const { error: rpcErr } = await supabase
    .rpc('increment_view_count', { article_id: artId });
  ok('T10 — RPC callable without error', !rpcErr, rpcErr?.message);

  const { data: after1 } = await supabase
    .from('articles').select('view_count').eq('id', artId).single();
  ok('T11 — view_count incremented by 1',
    after1?.view_count === before + 1,
    `before=${before}, after=${after1?.view_count}`);

  await supabase.rpc('increment_view_count', { article_id: artId });
  const { data: after2 } = await supabase
    .from('articles').select('view_count').eq('id', artId).single();
  ok('T12 — view_count accumulates on repeated calls',
    after2?.view_count === before + 2,
    `expected=${before + 2}, got=${after2?.view_count}`);
}

// ─────────────────────────────────────────────────────────────
// GROUP 4 — DB: fetchMostPopular ordering (2 tests)
// ─────────────────────────────────────────────────────────────
async function testFetchMostPopular() {
  console.log('\n🏆 GROUP 4: fetchMostPopular ordering');

  // The article we incremented twice should appear near top
  const { data, error } = await supabase
    .from('articles')
    .select('id, view_count')
    .order('view_count', { ascending: false, nullsFirst: false })
    .limit(5);

  ok('T13 — most-popular query succeeds', !error, error?.message);
  ok('T14 — most-viewed article is first in results',
    data && data.length > 0 && data[0].view_count >= (data[1]?.view_count ?? 0),
    `top=${data?.[0]?.view_count}, second=${data?.[1]?.view_count}`);
}

// ─────────────────────────────────────────────────────────────
// GROUP 5 — Code: GreatReads.tsx (3 tests)
// ─────────────────────────────────────────────────────────────
function testGreatReads() {
  console.log('\n🎓 GROUP 5: sections/GreatReads.tsx');
  const src = read('sections/GreatReads.tsx');

  ok('T15 — fetchByCategory uses "learn" not "Education"',
    src.includes("fetchByCategory('learn'") && !src.includes("fetchByCategory('Education'"));
  ok('T16 — "All courses" link points to /category/learn',
    src.includes('href="/category/learn"') && !src.includes('href="/category/education"'));
  ok('T17 — no stray "Education" category string remains',
    !src.includes("'Education'"));
}

// ─────────────────────────────────────────────────────────────
// GROUP 6 — Code: Footer.tsx (5 tests)
// ─────────────────────────────────────────────────────────────
function testFooter() {
  console.log('\n🦶 GROUP 6: sections/Footer.tsx');
  const src = read('sections/Footer.tsx');

  const newCats = ['models','agents','tools','research','business','policy','hardware','learn'];
  const missing = newCats.filter(c => !src.includes(`/category/${c}`));
  ok('T18 — all 8 new category hrefs present', missing.length === 0, missing.join(', '));
  ok('T19 — no /category/industry link',   !src.includes('/category/industry'));
  ok('T20 — no /category/coding link',     !src.includes('/category/coding'));
  ok('T21 — no /category/science link',    !src.includes('/category/science'));
  ok('T22 — no fake "GPT-5.3-Codex" entry', !src.includes('GPT-5.3-Codex'));
}

// ─────────────────────────────────────────────────────────────
// GROUP 7 — Code: LatestNews.tsx (4 tests)
// ─────────────────────────────────────────────────────────────
function testLatestNews() {
  console.log('\n📰 GROUP 7: sections/LatestNews.tsx');
  const src = read('sections/LatestNews.tsx');

  ok('T23 — import Link from next/link present',
    src.includes("import Link from 'next/link'"));
  ok('T24 — tags wrapped in <Link href="/tag/"> not <span>',
    src.includes('href={`/tag/${tag}`}') && !src.match(/<span[^>]*>[^<]*#\{tag\}/));
  ok('T25 — tags are siblings of article Link (no nested anchor)',
    src.indexOf('href={`/tag/${tag}`}') > src.indexOf('</Link>'));
  ok('T26 — article Link uses /article/[id] pattern',
    src.includes('href={`/article/${article.id}`}'));
}

// ─────────────────────────────────────────────────────────────
// GROUP 8 — Code: ArticleCard.tsx (3 tests)
// ─────────────────────────────────────────────────────────────
function testArticleCard() {
  console.log('\n🃏 GROUP 8: components/ArticleCard.tsx');
  const src = read('components/ArticleCard.tsx');

  ok('T27 — import Link from next/link added', src.includes("import Link from 'next/link'"));
  ok('T28 — TagList uses Link not span',
    src.includes('href={`/tag/${tag}`}') && !src.match(/<span[^>]+>#\{tag\}/));
  ok('T29 — hover styles on tag Links (interactive feedback)',
    src.includes('hover:text-ai-purple') || src.includes('hover:bg-ai-purple'));
}

// ─────────────────────────────────────────────────────────────
// GROUP 9 — Code: StockTicker.tsx (4 tests)
// ─────────────────────────────────────────────────────────────
function testStockTickerCode() {
  console.log('\n📈 GROUP 9: sections/StockTicker.tsx');
  const src = read('sections/StockTicker.tsx');

  ok('T30 — imports supabase client',         src.includes("from '@/lib/supabase'"));
  ok('T31 — queries stock_tickers table',     src.includes("from('stock_tickers')"));
  ok('T32 — FALLBACK_TICKERS constant present', src.includes('FALLBACK_TICKERS'));
  ok('T33 — uses change_pct field (not old "change" field)',
    src.includes('change_pct') && !src.includes('{ change:'));
}

// ─────────────────────────────────────────────────────────────
// GROUP 10 — Code: MostPopular + supabase.ts + ArticleClient (4 tests)
// ─────────────────────────────────────────────────────────────
function testMostPopularCode() {
  console.log('\n📊 GROUP 10: MostPopular + lib/supabase.ts + ArticleClient');
  const most   = read('sections/MostPopular.tsx');
  const lib    = read('lib/supabase.ts');
  const client = read('app/(main)/article/[id]/ArticleClient.tsx');

  ok('T34 — MostPopular uses fetchMostPopular (not fetchArticles)',
    most.includes('fetchMostPopular') && !most.includes('fetchArticles'));
  ok('T35 — supabase.ts: fetchMostPopular sorts by view_count',
    lib.includes('fetchMostPopular') && lib.includes('view_count'));
  ok('T36 — supabase.ts: incrementViewCount exported',
    lib.includes('incrementViewCount') && lib.includes('increment_view_count'));
  ok('T37 — ArticleClient calls incrementViewCount on article load',
    client.includes('incrementViewCount') && client.includes('incrementViewCount(article.id)'));
}

// ─────────────────────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║         Sprint 4 — Verification Test Suite        ║');
  console.log('╚═══════════════════════════════════════════════════╝');

  await testStockTickers();
  await testViewCount();
  await testIncrementRpc();
  await testFetchMostPopular();
  testGreatReads();
  testFooter();
  testLatestNews();
  testArticleCard();
  testStockTickerCode();
  testMostPopularCode();

  const total = passed + failed;
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log(`║  Results: ${String(passed).padStart(2)}/${total} passed`.padEnd(52) + '║');
  if (failures.length === 0) {
    console.log('║  ✅ All tests passed — Sprint 4 fully verified.   ║');
  } else {
    console.log(`║  ❌ ${failures.length} test(s) FAILED:`.padEnd(52) + '║');
    failures.forEach(f =>
      console.log(`║    • ${f.name}`.slice(0, 51).padEnd(51) + '║'));
  }
  console.log('╚═══════════════════════════════════════════════════╝\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
