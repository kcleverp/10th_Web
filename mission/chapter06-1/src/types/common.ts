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

export interface Lp {
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
  data: Lp[]; 
  nextCursor: number | null;
  hasMore: boolean;
}