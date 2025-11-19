import { createClient } from './client';

/**
 * Configuration for image uploads
 */
const IMAGE_CONFIG = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxWidth: 2048,
  maxHeight: 2048,
  compressionQuality: 0.8, // 80% quality for compressed images
} as const;

/**
 * Image metadata type
 */
export interface ImageMetadata {
  filename: string;
  size: number;
  width: number;
  height: number;
  type: string;
}

/**
 * Validate an image file before upload
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!IMAGE_CONFIG.allowedTypes.includes(file.type as any)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: JPEG, PNG, WebP`,
    };
  }

  // Check file size
  if (file.size > IMAGE_CONFIG.maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${IMAGE_CONFIG.maxSizeBytes / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Get image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Compress an image if it's too large
 * Returns the compressed image as a Blob, or the original file if no compression needed
 */
export async function compressImage(file: File): Promise<Blob> {
  const dimensions = await getImageDimensions(file);

  // If image is within limits, return original
  if (dimensions.width <= IMAGE_CONFIG.maxWidth && dimensions.height <= IMAGE_CONFIG.maxHeight) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = dimensions;
      if (width > IMAGE_CONFIG.maxWidth || height > IMAGE_CONFIG.maxHeight) {
        const ratio = Math.min(IMAGE_CONFIG.maxWidth / width, IMAGE_CONFIG.maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Create canvas and compress
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        IMAGE_CONFIG.compressionQuality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
}

/**
 * Upload an image to Supabase Storage
 * @param chatId - The ID of the chat this image belongs to
 * @param file - The image file to upload
 * @returns The public URL and metadata of the uploaded image
 */
export async function uploadChatImage(
  chatId: string,
  file: File
): Promise<{ url: string; metadata: ImageMetadata }> {
  const supabase = createClient();

  // Validate the image
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Get image dimensions
  const dimensions = await getImageDimensions(file);

  // Compress the image if needed
  const imageBlob = await compressImage(file);

  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${chatId}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('chat-images')
    .upload(filePath, imageBlob, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Create metadata
  const metadata: ImageMetadata = {
    filename: file.name,
    size: file.size,
    width: dimensions.width,
    height: dimensions.height,
    type: file.type,
  };

  return {
    url: data.path, // Store the path, not the public URL (more flexible)
    metadata,
  };
}

/**
 * Get the URL for a chat image (works with both public and private buckets)
 * @param imagePath - The storage path of the image
 * @returns Promise that resolves to the image URL
 */
export async function getChatImageUrl(imagePath: string): Promise<string> {
  const supabase = createClient();

  // Try to get a signed URL for private buckets (expires in 1 hour)
  const { data, error } = await supabase.storage
    .from('chat-images')
    .createSignedUrl(imagePath, 3600); // 1 hour expiry

  if (!error && data?.signedUrl) {
    return data.signedUrl;
  }

  // Fallback to public URL if signed URL fails
  const publicData = supabase.storage.from('chat-images').getPublicUrl(imagePath);
  return publicData.data.publicUrl;
}

/**
 * Delete a chat image from storage
 * @param imagePath - The storage path of the image to delete
 */
export async function deleteChatImage(imagePath: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from('chat-images').remove([imagePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Create a preview URL for a file (before upload)
 * Don't forget to revoke this URL when done!
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL created with createImagePreview
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}
