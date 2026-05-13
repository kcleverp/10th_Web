import type { ReactNode } from "react"

export type CommonResponse<T> = {
    status:boolean
    statusCode:number
    message:string
    data:T
}

export interface Author {
  id: number;
  name: string;
  avatar?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Like {
  id: number;
  userId: number;
  lpId: number;
}

export interface CommentAuthor {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: CommentAuthor;
}

export interface CommentListPayload {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface RequestUpsertLp {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export interface Lp {
  artist?: ReactNode | string;
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  published: boolean;
  authorId: number;
  author?: Author;
  createdAt: string; 
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
}

export interface LpListData {
  hasNext: any
  data: Lp[]; 
  nextCursor: number | null;
  hasMore: boolean;
}