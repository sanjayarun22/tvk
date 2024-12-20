export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category_id: string;
  author_id: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  is_verified: boolean;
  verification_token: string;
  created_at: string;
  verified_at: string | null;
}