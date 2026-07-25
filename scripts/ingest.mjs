import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import path from 'node:path';
import { RSS_FEEDS } from './feeds.mjs';
import { SYSTEM_PROMPT } from './prompt.mjs';

const isDryRun = process.argv.includes('--dry-run');
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'AINewsArabic/1.0' },
});

function sanitizeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
}

async function fetchRecentArticles() {
  console.log('📡 جاري قراءة خلاصات RSS وسحب الأخبار والأدوات...');
  const now = new Date();
  const yesterday = new Date(now.getTime() - 48 * 60 * 60 * 1000); // last 48 hours for buffer
  const items = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`  🔍 فحص: ${feed.name}`);
      const data = await parser.parseURL(feed.url);
      
      for (const entry of data.items || []) {
        const pubDate = entry.pubDate ? new Date(entry.pubDate) : new Date();
        if (pubDate >= yesterday) {
          items.push({
            title: entry.title || '',
            contentSnippet: entry.contentSnippet || entry.content || '',
            link: entry.link || feed.url,
            pubDate: pubDate.toISOString(),
            sourceName: feed.name,
            defaultCategory: feed.categoryDefault,
          });
        }
      }
    } catch (err) {
      console.warn(`  ⚠️ متعذر قراءة ${feed.name}: ${err.message}`);
    }
  }

  console.log(`✅ تم جمع ${items.length} مقال حديث من الخلاصات.`);
  return items;
}

async function summarizeWithGemini(articles) {
  if (!process.env.GEMINI_API_KEY) {
    try {
      const envContent = await fs.readFile(path.join(process.cwd(), '.env'), 'utf-8');
      const match = envContent.match(/GEMINI_API_KEY=(.+)/);
      if (match && match[1]) {
        process.env.GEMINI_API_KEY = match[1].trim();
      }
    } catch {}
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ لم يتم العثور على GEMINI_API_KEY. سيتم استخدام وضع التجربة المحاكاة (Mocking).');
    return {
      news: articles.slice(0, 3).map((art) => ({
        title: `ملخص: ${art.title}`,
        summary: art.contentSnippet.slice(0, 250) + '...',
        bodyMarkdown: `تم جلب هذا الخبر من **${art.sourceName}**.\n\n### التفاصيل:\n${art.contentSnippet.slice(0, 500)}`,
        category: art.defaultCategory,
        tags: ['AI', art.sourceName],
        sourceName: art.sourceName,
        sourceUrl: art.link,
        publishedAt: art.pubDate,
        importance: 4,
        toolsMentioned: [],
      })),
      tools: [],
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const articlesPrompt = articles.map((art, i) => `
--- مقال #${i + 1} ---
المصدر: ${art.sourceName}
العنوان الأصلي: ${art.title}
الرابط: ${art.link}
تاريخ النشر: ${art.pubDate}
النص/المقتطف:
${art.contentSnippet.slice(0, 2000)}
`).join('\n');

  console.log('🤖 جاري تحليل المقالات عبر Gemini 3.6 Flash لاستخراج الأخبار والأدوات الجديدة بالعربية...');

  const newsItemSchema = {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'عنوان صحفي جذاب ومختصر باللغة العربية' },
      summary: { type: 'string', description: 'ملخص للخبر من 2 إلى 4 جمل باللغة العربية' },
      bodyMarkdown: { type: 'string', description: 'تفاصيل الخبر بتنسيق ماركداون مقسم بنقاط وعناوين جانبية فرعية' },
      category: { type: 'string', description: 'التصنيف الأساسي للخبر' },
      tags: { type: 'array', items: { type: 'string' }, description: 'وسوم الكلمات المفتاحية باللغة الإنجليزية والعربية' },
      sourceName: { type: 'string', description: 'اسم المصدر الأصلي' },
      sourceUrl: { type: 'string', description: 'رابط المقال الأصلي' },
      publishedAt: { type: 'string', description: 'تاريخ النشر بصيغة ISO' },
      importance: { type: 'integer', description: 'معدل الأهمية من 1 إلى 5' },
      toolsMentioned: { type: 'array', items: { type: 'string' }, description: 'أسماء أي أدوات جديدة مذكورة' },
    },
    required: ['title', 'summary', 'bodyMarkdown', 'category', 'tags', 'sourceName', 'sourceUrl', 'publishedAt', 'importance'],
  };

  const toolItemSchema = {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'اسم الأداة أو التطبيق' },
      description: { type: 'string', description: 'وصف باللغة العربية للأداة وتطبيقاتها' },
      category: { type: 'string', description: 'التصنيف الأساسي للأداة' },
      url: { type: 'string', description: 'الرابط الرسمي للأداة أو رابط المقال' },
      pricing: { type: 'string', description: 'نوع التسعير: free أو freemium أو paid' },
      tags: { type: 'array', items: { type: 'string' }, description: 'وسوم الكلمات المفتاحية' },
    },
    required: ['name', 'description', 'category', 'url', 'pricing', 'tags'],
  };

  const responseSchema = {
    type: 'object',
    properties: {
      news: { type: 'array', items: newsItemSchema },
      tools: { type: 'array', items: toolItemSchema },
    },
    required: ['news', 'tools'],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: `إليك المقالات التالية المجلوبة حديثاً، قم بتجميع الأخبار البارزة واستخراج أي أدوات جديدة وتصدير النتائج باللغة العربية:\n\n${articlesPrompt}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.2,
    },
  });

  const rawJson = response.text;
  const parsed = JSON.parse(rawJson);
  return {
    news: parsed.news || [],
    tools: parsed.tools || [],
  };
}

async function main() {
  try {
    const articles = await fetchRecentArticles();

    if (articles.length === 0) {
      console.log('ℹ️ لا توجد مقالات جديدة خلال الـ 48 ساعة الماضية.');
      return;
    }

    const { news: newsList, tools: toolsList } = await summarizeWithGemini(articles);
    console.log(`✨ تم توليد ${newsList.length} خبر ملخص و ${toolsList.length} أداة جديدة.`);

    if (isDryRun) {
      console.log('\n--- 🧪 وضع الاختيار والتجربة (--dry-run) ---');
      console.log(JSON.stringify({ news: newsList, tools: toolsList }, null, 2));
      return;
    }

    // 1. Save News Markdown files
    const todayStr = new Date().toISOString().split('T')[0];
    const newsDir = path.join(process.cwd(), 'src', 'content', 'news', todayStr);
    await fs.mkdir(newsDir, { recursive: true });

    for (const item of newsList) {
      const slug = sanitizeSlug(item.sourceName + '-' + item.title.slice(0, 30));
      const filePath = path.join(newsDir, `${slug}.md`);

      const frontmatter = `---
title: ${JSON.stringify(item.title)}
summary: ${JSON.stringify(item.summary)}
category: ${JSON.stringify(item.category)}
tags: ${JSON.stringify(item.tags || [])}
sourceName: ${JSON.stringify(item.sourceName)}
sourceUrl: ${JSON.stringify(item.sourceUrl)}
publishedAt: ${JSON.stringify(item.publishedAt || new Date().toISOString())}
importance: ${item.importance || 3}
toolsMentioned: ${JSON.stringify(item.toolsMentioned || [])}
---

${item.bodyMarkdown}
`;

      await fs.writeFile(filePath, frontmatter, 'utf-8');
      console.log(`  📰 تم حفظ الخبر: ${filePath}`);
    }

    // 2. Save Tools Markdown files
    const toolsDir = path.join(process.cwd(), 'src', 'content', 'tools');
    await fs.mkdir(toolsDir, { recursive: true });

    const validPricing = ['free', 'freemium', 'paid'];

    for (const tool of toolsList) {
      const slug = sanitizeSlug(tool.name);
      const filePath = path.join(toolsDir, `${slug}.md`);

      // Check if tool file already exists to prevent overwriting custom entries
      try {
        await fs.access(filePath);
        console.log(`  ℹ️ الأداة موجودة مسبقاً، تم تخطي: ${slug}`);
        continue;
      } catch {
        // File does not exist, write new tool
      }

      const pricing = validPricing.includes(tool.pricing?.toLowerCase()) ? tool.pricing.toLowerCase() : 'freemium';

      const toolFrontmatter = `---
name: ${JSON.stringify(tool.name)}
description: ${JSON.stringify(tool.description)}
category: ${JSON.stringify(tool.category || 'أدوات وتطبيقات')}
url: ${JSON.stringify(tool.url || 'https://google.com')}
pricing: ${JSON.stringify(pricing)}
tags: ${JSON.stringify(tool.tags || [])}
addedAt: ${JSON.stringify(new Date().toISOString())}
---

${tool.description}
`;

      await fs.writeFile(filePath, toolFrontmatter, 'utf-8');
      console.log(`  🛠️ تم حفظ أداة جديدة: ${filePath}`);
    }

    console.log('🎉 اكتملت عملية الجلب والتلخيص وحفظ الأدوات بنجاح!');
  } catch (err) {
    console.error('❌ خطأ أثناء تنفيذ عملية الجلب والتلخيص:', err);
    process.exit(1);
  }
}

main();
