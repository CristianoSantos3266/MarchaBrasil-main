// Image processing utilities for privacy protection

export interface BlurDetectionResult {
  needsFaceBlur: boolean;
  needsPlateBlur: boolean;
  safetyScore: number;
  detectedObjects: string[];
}

export async function analyzeImageForPrivacy(imageFile: File): Promise<BlurDetectionResult> {
  // In a real implementation, this would use AI/ML services like:
  // - Google Vision API for face detection
  // - Custom license plate detection
  // - Content safety analysis
  
  return new Promise((resolve) => {
    // Simulated analysis - in production would use actual AI services
    setTimeout(() => {
      const randomScore = Math.random();
      
      resolve({
        needsFaceBlur: randomScore > 0.3, // 70% chance faces detected
        needsPlateBlur: randomScore > 0.7, // 30% chance plates detected
        safetyScore: Math.floor(randomScore * 40 + 60), // 60-100 range
        detectedObjects: [
          ...(randomScore > 0.3 ? ['faces'] : []),
          ...(randomScore > 0.7 ? ['license_plates'] : []),
          ...(randomScore > 0.5 ? ['people'] : []),
          ...(randomScore > 0.8 ? ['vehicles'] : [])
        ]
      });
    }, 1500);
  });
}

export function createBlurredCanvas(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Apply blur filter to simulate face/plate blurring
      // In production, this would use precise coordinates from AI detection
      ctx.filter = 'blur(8px)';
      
      // Simulate blurring face areas (top third of image)
      const faceRegions = [
        { x: img.width * 0.2, y: img.height * 0.1, w: img.width * 0.3, h: img.height * 0.25 },
        { x: img.width * 0.6, y: img.height * 0.15, w: img.width * 0.25, h: img.height * 0.2 }
      ];
      
      faceRegions.forEach(region => {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(region.x, region.y, region.w, region.h);
      });
      
      // Simulate blurring license plate areas (bottom third)
      const plateRegions = [
        { x: img.width * 0.1, y: img.height * 0.7, w: img.width * 0.2, h: img.height * 0.08 }
      ];
      
      plateRegions.forEach(region => {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(region.x, region.y, region.w, region.h);
      });
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
}

export function createThumbnail(imageFile: File, maxSize: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'Image must be smaller than 10MB' };
  }
  
  // Check file extension
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  return { isValid: true };
}

export function generateImageHash(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      resolve(hashHex.substring(0, 16)); // Use first 16 chars as ID
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(imageFile);
  });
}