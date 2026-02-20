import type { Metadata } from 'next';
import { fetchArticleById } from '@/lib/supabase';
import ArticleClient from './ArticleClient';

const SITE_URL = 'https://aifreshdaily.com';

// ── SSR metadata — Google sees full Open Graph tags ──────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const article = await fetchArticleById(id);
  if (!article) {
    return { title: 'Article Not Found | AI Fresh Daily' };
  }

  const summary = article.summary || article.excerpt || article.headline;
  const description = summary.slice(0, 160);
  const url = `${SITE_URL}/article/${id}`;

  return {
    title: article.headline,
    description,
    openGraph: {
      type: 'article',
      url,
      title: article.headline,
      description,
      images: article.image ? [{ url: article.image, width: 1200, height: 630 }] : [],
      publishedTime: article.publishedAt,
      authors: [article.author || 'AI Fresh Daily Editorial'],
      section: article.category,
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.headline,
      description,
      images: article.image ? [article.image] : [],
    },
    alternates: { canonical: url },
  };
}

// ── JSON-LD structured data ───────────────────────────────────────────
function ArticleJsonLd({ article }: { article: NonNullable<Awaited<ReturnType<typeof fetchArticleById>>> }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description: (article.summary || article.excerpt || '').slice(0, 200),
    url: `${SITE_URL}/article/${article.id}`,
    image: article.image || `${SITE_URL}/og-image.png`,
    datePublished: article.publishedAt || new Date().toISOString(),
    author: { '@type': 'Person', name: article.author || 'AI Fresh Daily Editorial' },
    publisher: {
      '@type': 'Organization',
      name: 'AI Fresh Daily',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
    },
    articleSection: article.category,
    keywords: (article.tags ?? []).join(', '),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Server Component page ─────────────────────────────────────────────
export default async function ArticlePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await fetchArticleById(id);

  return (
    <>
      {article && <ArticleJsonLd article={article} />}
      <ArticleClient id={id} initialArticle={article} />
    </>
  );
}
