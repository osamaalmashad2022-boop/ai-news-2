import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '../lib/site';

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).default([]),
    sourceName: z.string(),
    sourceUrl: z.string().url(),
    publishedAt: z.coerce.date(),
    importance: z.number().min(1).max(5).default(3),
    toolsMentioned: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(CATEGORIES),
    url: z.string().url(),
    pricing: z.enum(['free', 'freemium', 'paid']),
    tags: z.array(z.string()).default([]),
    logo: z.string().optional(),
    addedAt: z.coerce.date(),
    sourceUrl: z.string().url().optional(),
  }),
});

export const collections = {
  news: newsCollection,
  tools: toolsCollection,
};
