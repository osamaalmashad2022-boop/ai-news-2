import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const news = await getCollection('news');
  const sortedNews = news.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  const siteBase = (context.site || 'https://ai-news-arabic.vercel.app').toString().replace(/\/$/, '');

  return rss({
    title: 'نبض الذكاء - أخبار الذكاء الاصطناعي اليومية',
    description: 'أهم أخبار وابتكارات الذكاء الاصطناعي ملخصة باللغة العربية وموثقة يومياً من المصادر العالمية',
    site: context.site || 'https://ai-news-arabic.vercel.app',
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    items: sortedNews.map((item) => {
      const mediaContent = item.data.image
        ? `<media:content url="${item.data.image}" medium="image"><media:title><![CDATA[${item.data.title}]]></media:title><media:description><![CDATA[${item.data.summary}]]></media:description></media:content>`
        : '';
      return {
        title: item.data.title,
        pubDate: item.data.publishedAt,
        description: item.data.summary,
        link: `/news/${item.slug}/`,
        categories: [item.data.category],
        customData: [
          `<source url="${item.data.sourceUrl}">${item.data.sourceName}</source>`,
          mediaContent,
        ].filter(Boolean).join(''),
      };
    }),
    customData: `<language>ar</language>`,
  });
}
