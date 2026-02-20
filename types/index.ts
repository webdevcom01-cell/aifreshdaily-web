export interface ArticleSource {
  name: string;
  url: string;
  favicon?: string;
}

export interface Article {
  id: string;
  headline: string;
  excerpt?: string;
  image: string;
  category: string;
  author?: string;
  readTime: string;
  publishedAt?: string;
  isExclusive?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  body?: string;
  slug?: string;
  source?: ArticleSource;
  tags?: string[];
  summary?: string;
  keyPoints?: string[];
  whyItMatters?: string;
  originalUrl?: string;
}

export interface AIStock {
  symbol: string;
  name: string;
  price?: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'funding' | 'index';
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  icon?: string;
}

export interface AIModelScores {
  overall: number;
  coding: number;
  reasoning: number;
  creative: number;
}

export interface AIModel {
  rank: number;
  name: string;
  company: string;
  score: number;
  category: string;
  scores?: AIModelScores;
  change?: 'up' | 'down' | 'same';
  contextWindow?: string;
  highlight?: string;
}

export interface AIVoice {
  name: string;
  title: string;
  company: string;
  avatar: string;
  quote: string;
  articleLink?: string;
}

export interface TimelineEvent {
  year: string;
  quarter?: string;
  title: string;
  description: string;
  type: 'past' | 'present' | 'future';
}

export interface RegulationItem {
  id: string;
  title: string;
  region: 'EU' | 'US' | 'China' | 'Global';
  status: 'enacted' | 'pending' | 'proposed';
  deadline?: string;
  daysRemaining?: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
}
