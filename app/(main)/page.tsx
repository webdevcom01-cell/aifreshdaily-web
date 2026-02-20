import HeroSection from '@/sections/HeroSection';
import LatestNews from '@/sections/LatestNews';
import FeaturedSection from '@/sections/FeaturedSection';
import MostPopular from '@/sections/MostPopular';
import GreatReads from '@/sections/GreatReads';
import VideosSection from '@/sections/VideosSection';
import TrendingTopics from '@/sections/TrendingTopics';
import NewsletterSection from '@/sections/NewsletterSection';
import ModelScoreboard from '@/sections/ModelScoreboard';
import AIVoicesSection from '@/sections/AIVoicesSection';
import RegulationTracker from '@/sections/RegulationTracker';
import AITimeline from '@/sections/AITimeline';
import CodingSection from '@/sections/CodingSection';
import IndustryDeepDive from '@/sections/IndustryDeepDive';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestNews />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <ModelScoreboard />
            <CodingSection />
            <IndustryDeepDive />
            <VideosSection />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <FeaturedSection />
            <MostPopular />
            <RegulationTracker />
          </div>
        </div>
      </div>
      <AIVoicesSection />
      <TrendingTopics />
      <GreatReads />
      <AITimeline />
      <NewsletterSection />
    </>
  );
}
