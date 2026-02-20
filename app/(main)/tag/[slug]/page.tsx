import type { Metadata } from 'next';
import TagClient from './TagClient';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const label = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const description = `All AI Fresh Daily articles tagged with "${slug}". Latest news, analysis and insights.`;

  return {
    title: `#${slug}`,
    description,
    openGraph: {
      title: `#${slug} | AI Fresh Daily`,
      description,
      url: `https://aifreshdaily.com/tag/${slug}`,
    },
    alternates: { canonical: `https://aifreshdaily.com/tag/${slug}` },
  };
}

export default async function TagPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return <TagClient slug={slug} />;
}
