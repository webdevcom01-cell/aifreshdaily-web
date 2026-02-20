"use client"
import Link from 'next/link';
import type { Article } from '@/types';

interface CategorySectionProps {
  title: string;
  articles: Article[];
  accentColor?: string;
  icon?: React.ReactNode;
  /** Route for the "View all" link, e.g. "/category/models" */
  viewAllHref?: string;
}

export default function CategorySection({ title, articles, icon, viewAllHref }: CategorySectionProps) {
  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1);

  return (
    <section className="py-8 bg-white dark:bg-ai-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-heading">{title}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-ai-purple/20 to-transparent" />
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-ai-purple dark:text-ai-cyan hover:underline"
            >
              View all →
            </Link>
          ) : (
            <span className="text-sm font-medium text-ai-purple dark:text-ai-cyan">
              View all →
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Article */}
          <div className="lg:col-span-7">
            <Link href={`/article/${mainArticle.id}`} className="group block cursor-pointer">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={mainArticle.image}
                  alt={mainArticle.headline}
                  className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-ai-space/80 backdrop-blur-sm text-ai-cyan text-xs font-bold uppercase tracking-wider rounded-full">
                    {mainArticle.category}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading">
                  {mainArticle.headline}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-mono-ai">{mainArticle.readTime}</p>
              </div>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="lg:col-span-5 space-y-5">
            {sideArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className={`group block ${index !== sideArticles.length - 1 ? 'pb-5 border-b border-gray-200 dark:border-ai-space-medium' : ''
                  }`}
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-ai-purple dark:text-ai-cyan font-medium uppercase tracking-wider">{article.category}</span>
                    <h4 className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-ai-purple dark:group-hover:text-ai-cyan transition-colors font-heading line-clamp-2">
                      {article.headline}
                    </h4>
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono-ai">{article.readTime}</p>
                  </div>
                  <div className="flex-shrink-0 w-24">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={article.image}
                        alt={article.headline}
                        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
