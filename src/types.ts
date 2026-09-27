export interface UserRecord {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
}

export interface PostRecord {
  postId: string;
  content: string;
  date: number;
  userId: string;
  likes?: string[];
}
