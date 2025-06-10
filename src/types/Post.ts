export interface Post {
  id: number;
  title: string;
  author_id: number | null;
  content: string;
  thumbnail: PostThumbnail | null;
}

// thumbnail указывается отдельно при создании поста, поэтому PostCreationData его не содержит
export interface PostCreationData {
  title: string;
  authorId: number;
  content: string;
}

export type PostCreationDataWithThumbnail = PostCreationData & {
  thumbnail?: PostThumbnail;
};

export type PostThumbnail = string;
