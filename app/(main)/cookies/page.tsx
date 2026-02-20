import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Home</span>
      </Link>
      <div className="prose dark:prose-invert max-w-none">
        <h1 className="font-heading text-3xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: January 2025</p>
        <p className="mt-6">This page is under construction. Please check back soon.</p>
      </div>
    </div>
  );
}
