import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseConfig';
import { compressImage } from '../../lib/imageUtils';

export default function NewsEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = '';
      
      if (image) {
        // Compress image before upload
        const compressedImage = await compressImage(image, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920
        });

        const fileName = `${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(fileName, compressedImage);

        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from('news-images').getPublicUrl(fileName).data.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          category_id: category,
          featured_image: imageUrl,
          status: 'published',
          published_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Clear form
      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Publishing...' : 'Publish News'}
      </button>
    </form>
  );
}