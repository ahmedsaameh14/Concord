export interface ArticleSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  socialLinks?: ArticleSocialLinks;
  tags: string[];
  publishedAt?: string;
  isTopArticle: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleListResponse {
  message: string;
  data: Article[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    topArticle?: Article | null;
    tags?: string[];
  };
}

export interface ArticleResponse {
  message: string;
  data: Article;
}

export interface ArticleListQuery {
  search?: string;
  tags?: string;
  page?: number;
  limit?: number;
  isActive?: 'true' | 'false' | '';
  isTopArticle?: 'true' | 'false' | '';
  admin?: 'true';
}

export interface Award {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AwardListResponse {
  message: string;
  data: Award[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AwardResponse {
  message: string;
  data: Award;
}

export interface AwardListQuery {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: 'true' | 'false' | '';
  admin?: 'true';
}
