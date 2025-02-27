export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Comment {
  id: number;
  username: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  slug: string;
  coverPhoto: string;
  tags: Tag[];
  comments: Comment[];
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse {
  data: Post[];
  pagination: Pagination;
}

export interface Comment {
  id: number;
  username: string;
  text: string;
  createdAt: string;
}

export interface CommentResponse {
  data: Comment[];
  pagination: Pagination;
}
