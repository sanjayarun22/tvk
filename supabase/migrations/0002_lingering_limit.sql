/*
  # News Blog Database Schema

  1. New Tables
    - `articles`
      - Core news article content
      - Includes title, content, author, category, etc.
    - `categories`
      - News categories (e.g., Politics, Technology)
    - `comments`
      - User comments on articles
    - `likes`
      - Track article likes/reactions
    
  2. Security
    - RLS policies for all tables
    - Public read access for published content
    - Authenticated write access for user-specific actions
*/

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  category_id uuid REFERENCES categories(id),
  author_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
  ON articles FOR SELECT
  TO authenticated, anon
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Authors can manage their articles"
  ON articles FOR ALL
  TO authenticated
  USING (author_id = auth.uid());

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Likes Table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can manage their likes"
  ON likes FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Insert some initial categories
INSERT INTO categories (name, slug, description) VALUES
  ('Politics', 'politics', 'Political news and updates'),
  ('Technology', 'technology', 'Latest in tech and innovation'),
  ('Sports', 'sports', 'Sports news and coverage'),
  ('Entertainment', 'entertainment', 'Entertainment and celebrity news'),
  ('Business', 'business', 'Business and financial news')
ON CONFLICT (slug) DO NOTHING;