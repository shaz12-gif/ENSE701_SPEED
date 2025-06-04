import { Article } from '../article/article.schema';

export interface SearchArticlesQuery {
  term?: string;
  practice?: string;
  year?: string | number;
  sort?: 'newest' | 'oldest' | 'title';
  limit?: string | number;
  page?: string | number;
}

export interface SearchArticlesResult {
  articles: Article[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  error?: string;
}
