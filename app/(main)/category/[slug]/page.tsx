import type { Metadata } from 'next';
import CategoryClient from './CategoryClient';

const categoryMeta: Record<string, { label: string; description: string }> = {
  models:     { label: 'Models & LLMs',  description: 'The latest large language models, architectures, and benchmark results from OpenAI, Anthropic, Google, and more.' },
  agents:     { label: 'AI Agents',      description: 'Multi-agent systems, autonomous workflows, and the rise of agentic AI across enterprise and consumer platforms.' },
  industry:   { label: 'Industry',       description: 'How AI is transforming healthcare, finance, legal, education, manufacturing, and every sector in between.' },
  coding:     { label: 'AI Coding',      description: 'Agentic coding tools, AI-assisted development, and the future of software engineering.' },
  regulation: { label: 'Regulation',     description: 'Global AI policy, the EU AI Act, and the evolving regulatory landscape for artificial intelligence.' },
  science:    { label: 'Science',        description: 'Quantum computing, robotics, edge AI, and cutting-edge research at the frontier of technology.' },
  education:  { label: 'AI Academy',     description: 'Tutorials, explainers, and educational content for understanding AI — from beginner to advanced.' },
  video:      { label: 'Video',          description: 'Demos, comparisons, deep dives, and explainer videos covering the AI landscape.' },
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMeta[slug];
  const label = meta?.label || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const description = meta?.description || `Latest AI news in the ${label} category.`;

  return {
    title: label,
    description,
    openGraph: {
      title: `${label} | AI Fresh Daily`,
      description,
      url: `https://aifreshdaily.com/category/${slug}`,
    },
    alternates: { canonical: `https://aifreshdaily.com/category/${slug}` },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
