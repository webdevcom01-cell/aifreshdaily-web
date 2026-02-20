"use client"
import { Play, Film, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Static video data — inlined from data/articles.ts
const videos = [
  {
    id: 'v1',
    title: 'GPT-5.3-Codex Live Demo: Watch AI Build a Full App in Minutes',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
    duration: '8:42',
    category: 'Demo',
  },
  {
    id: 'v2',
    title: 'Claude Opus 4.6 vs GPT-5.3: Head-to-Head Coding Challenge',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=640&h=360&fit=crop',
    duration: '12:15',
    category: 'Comparison',
  },
  {
    id: 'v3',
    title: 'Inside Kimi K2.5: Agent Swarm Explained in 5 Minutes',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=360&fit=crop',
    duration: '5:03',
    category: 'Explainer',
  },
  {
    id: 'v4',
    title: 'DeepSeek V4 Architecture Deep Dive: Sparse Attention & 1M Context',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&h=360&fit=crop',
    duration: '15:27',
    category: 'Deep Dive',
  },
  {
    id: 'v5',
    title: 'EU AI Act: What Changes in August 2026 — Quick Guide',
    thumbnail: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=640&h=360&fit=crop',
    duration: '6:14',
    category: 'Policy',
  },
  {
    id: 'v6',
    title: "Grok 5: First Look at xAI's 6-Trillion Parameter Model",
    thumbnail: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=640&h=360&fit=crop',
    duration: '4:30',
    category: 'First Look',
  },
];

export default function VideosSection() {
  return (
    <section className="py-8 bg-white dark:bg-ai-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Film className="w-5 h-5 text-ai-purple dark:text-ai-cyan" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">AI Lab — Video</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-ai-purple/20 to-transparent" />
          <Link href="/category/video" className="text-sm font-medium text-ai-purple dark:text-ai-cyan hover:underline flex items-center gap-1 group">
            All videos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 6).map((video) => (
            <Link
              key={video.id}
              href={`/article/${video.id}`}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 ai-gradient-bg rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ai-glow-sm">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 text-white text-xs font-mono-ai rounded">
                  {video.duration}
                </div>
                {/* Category Badge */}
                {video.category && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-ai-purple/80 backdrop-blur-sm text-white text-xs font-bold uppercase rounded-full">
                    {video.category}
                  </div>
                )}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading line-clamp-2">
                {video.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
