import type { Metadata } from 'next';
import CategoryClient from './CategoryClient';

const categoryMeta: Record<string, { label: string; description: string }> = {
  models:   { label: 'Models & LLMs', description: 'The latest large language models, architectures, and benchmark results from OpenAI, Anthropic, Google, and more.' },
  agents:   { label: 'AI Agents',     description: 'Multi-agent systems, autonomous workflows, and the rise of agentic AI across enterprise and consumer platforms.' },
  tools:    { label: 'Tools',         description: 'AI apps, APIs, SDKs, developer tools, and AI-powered products shaping how we build and work.' },
  research: { label: 'Research',      description: 'Academic papers, lab breakthroughs, and scientific studies pushing the frontier of AI.' },
  business: { label: 'Business',      description: 'Funding rounds, acquisitions, partnerships, and the market forces driving the AI economy.' },
  policy:   { label: 'Policy',        description: 'Global AI regulation, governance, ethics, safety policy, and the evolving legal landscape.' },
  hardware: { label: 'Hardware',      description: 'Chips, GPUs, data centers, edge AI, and the compute infrastructure powering the AI revolution.' },
  learn:    { label: 'Learn',         description: 'Tutorials, explainers, courses, and how-to guides — AI knowledge for every level.' },
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
