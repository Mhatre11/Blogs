export interface Blog {
  blogId: number;
  title: string;
  description: string;
  content: string;
  image: string;
  IsFeatured: boolean;
  categoryId: number;
  createdAt?: string;  // Optional since some existing blogs might not have it
}
