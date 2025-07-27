export interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  clickCount: number;
  createdAt: Date;
  userId: string;
  userEmail: string;
}

export interface PublicLink {
  originalUrl: string;
  userId: string;
  createdAt: Date;
}