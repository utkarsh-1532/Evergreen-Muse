export const compressImage = (
  file: File,
  options: { maxWidth: number; quality: number }
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Calculate the new dimensions
      if (width > options.maxWidth) {
        height = (options.maxWidth / width) * height;
        width = options.maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Canvas to Blob conversion failed'));
          }

          // Create a new file from the blob
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg', // Force JPEG for compression
            lastModified: Date.now(),
          });
          
          URL.revokeObjectURL(img.src); // Clean up memory
          resolve(compressedFile);
        },
        'image/jpeg',
        options.quality
      );
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src);
      reject(error);
    };
  });
};
