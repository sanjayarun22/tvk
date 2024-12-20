import { supabase } from './supabase';
import type { Article, Category, UserPreferences, PushSubscription, NewsletterSubscription } from './types';

// Articles
export async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });
  
  if (error) throw error;
  return data as Article[];
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Category[];
}

// User Preferences
export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as UserPreferences | null;
}

// Push Subscriptions
export async function savePushSubscription(subscription: Partial<PushSubscription>) {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .insert(subscription)
    .select()
    .single();
  
  if (error) throw error;
  return data as PushSubscription;
}

// Newsletter Subscriptions
export async function subscribeToNewsletter(email: string) {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert({ email })
    .select()
    .single();
  
  if (error) throw error;
  return data as NewsletterSubscription;
}