export const RSS_FEEDS = [
  // كبرى الشركات والمختبرات
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml', categoryDefault: 'نماذج لغوية' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', categoryDefault: 'نماذج لغوية' },
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', categoryDefault: 'البرمجة' },

  // منصات الأخبار التقنية المتخصصة
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', categoryDefault: 'الأعمال والتمويل' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', categoryDefault: 'الأعمال والتمويل' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/index.xml', categoryDefault: 'أدوات وتطبيقات' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', categoryDefault: 'الأبحاث' },
  { name: 'The Decoder', url: 'https://the-decoder.com/feed/', categoryDefault: 'نماذج لغوية' },
  { name: 'MarkTechPost', url: 'https://www.marktechpost.com/feed/', categoryDefault: 'الأبحاث' },
  { name: 'Ars Technica AI', url: 'https://feeds.arstechnica.com/arstechnica/index', categoryDefault: 'أدوات وتطبيقات' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/category/business/latest/rss', categoryDefault: 'الأعمال والتمويل' },
];

export const CATEGORIES = [
  'نماذج لغوية',
  'توليد الصور والفيديو',
  'الصوت',
  'البرمجة',
  'الأبحاث',
  'الأعمال والتمويل',
  'السياسات والأخلاقيات',
  'أدوات وتطبيقات'
];
