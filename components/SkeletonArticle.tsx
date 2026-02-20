"use client"
export default function SkeletonArticle() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-8">
                    {/* Back button skeleton */}
                    <div className="w-24 h-6 skeleton mb-6" />

                    {/* Headline skeleton */}
                    <div className="w-full h-12 skeleton mb-4" />
                    <div className="w-3/4 h-12 skeleton mb-8" />

                    {/* Meta skeleton */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full skeleton" />
                        <div className="space-y-2">
                            <div className="w-32 h-4 skeleton" />
                            <div className="w-24 h-3 skeleton" />
                        </div>
                    </div>

                    {/* Main image skeleton */}
                    <div className="w-full aspect-video skeleton mb-10" />

                    {/* Content paragraphs */}
                    <div className="space-y-4">
                        <div className="w-full h-4 skeleton" />
                        <div className="w-full h-4 skeleton" />
                        <div className="w-5/6 h-4 skeleton" />
                        <div className="w-full h-4 skeleton" />
                        <div className="w-4/5 h-4 skeleton" />
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 space-y-4">
                        <div className="w-32 h-6 skeleton" />
                        <div className="w-full h-24 skeleton" />
                        <div className="w-full h-10 skeleton" />
                    </div>

                    <div className="space-y-4">
                        <div className="w-48 h-6 skeleton" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-20 h-20 rounded-lg skeleton flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="w-full h-4 skeleton" />
                                    <div className="w-1/2 h-3 skeleton" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
