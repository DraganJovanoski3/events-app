import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly MAX_WIDTH = 800;
  private readonly MAX_HEIGHT = 800;
  private readonly QUALITY = 0.5;

  constructor() {}

  async compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            if (width > height) {
              if (width > this.MAX_WIDTH) {
                height = Math.round((height * this.MAX_WIDTH) / width);
                width = this.MAX_WIDTH;
              }
            } else {
              if (height > this.MAX_HEIGHT) {
                width = Math.round((width * this.MAX_HEIGHT) / height);
                height = this.MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert to base64 and remove data URL prefix
            const base64 = canvas.toDataURL('image/jpeg', this.QUALITY).split(',')[1];
            resolve(base64);
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = event.target?.result as string;
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  decompressImage(base64: string): string {
    // Add data URL prefix for display
    return `data:image/jpeg;base64,${base64}`;
  }

  async compressMultipleImages(files: File[]): Promise<string[]> {
    const compressedImages: string[] = [];
    for (const file of files) {
      try {
        const compressedImage = await this.compressImage(file);
        compressedImages.push(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
      }
    }
    return compressedImages;
  }
} 