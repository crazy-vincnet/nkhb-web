export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Optimizes an image file using the Canvas API.
 * Resizes the image if it exceeds maxWidth/maxHeight and converts it to the specified format/quality.
 */
export const optimizeImage = async (file: File, options: OptimizeOptions = {}): Promise<Blob | File> => {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8, format = 'image/webp' } = options;

  // Skip optimization for non-image files or formats that shouldn't be compressed
  const skipFormats = ['image/svg+xml', 'image/gif'];
  if (!file.type.startsWith('image/') || skipFormats.includes(file.type)) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Proportional resizing logic
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas context could not be created'));
        return;
      }

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to Blob (WebP preferred)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      }, format, quality);
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };

    img.src = objectUrl;
  });
};
