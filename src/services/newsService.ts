import { mock } from './api';
import { news } from '@/data/db';
import type { NewsItem } from '@/types';
import { ApiError } from '@/utils/errors';

// Django: GET /api/news/
export const getNews = (): Promise<NewsItem[]> => mock(() => [...news].sort((a, b) => b.date.localeCompare(a.date)));

// Django: GET /api/news/:slug/
export const getNewsItem = (slug: string): Promise<NewsItem> =>
  mock(() => {
    const n = news.find(x => x.slug === slug);
    if (!n) throw new ApiError('Article not found.', 404);
    return n;
  });

// Django: POST /api/news/
export const createNews = (input: Omit<NewsItem, 'id' | 'body' | 'color' | 'slug'>): Promise<NewsItem> =>
  mock(() => {
    const id = Math.max(0, ...news.map(n => n.id)) + 1;
    const item: NewsItem = { ...input, id, slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), body: [input.excerpt], color: '#39FF14' };
    news.unshift(item);
    return item;
  });

// Django: DELETE /api/news/:id/
export const deleteNews = (id: number): Promise<void> =>
  mock(() => {
    const i = news.findIndex(n => n.id === id);
    if (i >= 0) news.splice(i, 1);
  }, 250);
