export const CATEGORIES = [
  'نماذج لغوية',
  'توليد الصور والفيديو',
  'الصوت',
  'البرمجة',
  'الأبحاث',
  'الأعمال والتمويل',
  'السياسات والأخلاقيات',
  'أدوات وتطبيقات',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_BADGE_STYLES: Record<string, string> = {
  'نماذج لغوية': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'توليد الصور والفيديو': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'الصوت': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  'البرمجة': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'الأبحاث': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'الأعمال والتمويل': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'السياسات والأخلاقيات': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  'أدوات وتطبيقات': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
};

export const DEFAULT_BADGE_STYLE = 'bg-gray-500/10 text-gray-400 border-gray-500/30';

export function categoryBadgeStyle(category: string): string {
  return CATEGORY_BADGE_STYLES[category] ?? DEFAULT_BADGE_STYLE;
}

export const PRICING_MAP = {
  free: { label: 'مجاني 100%', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  freemium: { label: 'مجاني مع خيارات مدفوعة', style: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  paid: { label: 'مدفوع', style: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
} as const;

export const ARABIC_DATE_FORMAT = new Intl.DateTimeFormat('ar-EG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const SITE_NAME = 'نبض الذكاء';
export const NEWS_PAGE_SIZE = 18;

export function sortNewsByDate<T extends { data: { publishedAt: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function sortToolsByDate<T extends { data: { addedAt: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.addedAt.getTime() - a.data.addedAt.getTime());
}
