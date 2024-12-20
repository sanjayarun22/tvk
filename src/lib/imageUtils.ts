import imageCompression from 'image-compression';

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      useWebWorker: true
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}