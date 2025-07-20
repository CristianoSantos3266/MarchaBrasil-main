'use client';

import { useState, useRef } from 'react';
import { CommunityImage } from '@/types';
import { 
  validateImageFile, 
  analyzeImageForPrivacy, 
  createBlurredCanvas, 
  createThumbnail,
  generateImageHash 
} from '@/utils/imageProcessing';

interface ImageUploadProps {
  protestId: string;
  onUploadComplete: (image: CommunityImage) => void;
}

export default function ImageUpload({ protestId, onUploadComplete }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setCurrentStep('Validating image...');

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      setUploadProgress(20);

      // Analyze for privacy concerns
      setCurrentStep('Analyzing for privacy protection...');
      const analysis = await analyzeImageForPrivacy(file);
      setUploadProgress(40);

      // Create blurred version
      setCurrentStep('Creating privacy-protected version...');
      const blurredUrl = await createBlurredCanvas(file);
      setUploadProgress(60);

      // Create thumbnail
      setCurrentStep('Generating thumbnail...');
      const thumbnailUrl = await createThumbnail(file);
      setUploadProgress(80);

      // Generate unique ID
      const imageId = await generateImageHash(file);
      setUploadProgress(90);

      // Create community image object
      const communityImage: CommunityImage = {
        id: imageId,
        originalUrl: previewUrl, // In production, would upload to secure storage
        blurredUrl: blurredUrl,
        thumbnailUrl: thumbnailUrl,
        uploadedAt: new Date().toISOString(),
        status: 'pending',
        reportedCount: 0,
        upvotes: 0,
        tags: analysis.detectedObjects
      };

      setCurrentStep('Upload complete!');
      setUploadProgress(100);

      // Notify parent component
      onUploadComplete(communityImage);

      // Reset form
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setCurrentStep('');
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1500);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📸 Share Community Photos
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Help document this event! Upload photos that show the scale and spirit of the protest.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h4 className="font-semibold text-blue-800 text-sm mb-2">🔒 Privacy Protection:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Faces are automatically blurred to protect participant privacy</li>
            <li>• License plates are obscured for security</li>
            <li>• All images are reviewed before being made public</li>
            <li>• Upload is completely anonymous</li>
          </ul>
        </div>
      </div>

      {!isUploading ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-2">
            Max 10MB • JPEG, PNG, WebP • Faces and plates will be automatically blurred
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {previewUrl && (
            <div className="flex justify-center">
              <img 
                src={previewUrl} 
                alt="Upload preview" 
                className="max-w-48 max-h-48 object-cover rounded border"
              />
            </div>
          )}
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{currentStep}</span>
              <span className="text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>Guidelines:</strong> Upload peaceful, non-violent images that show the event's scale and atmosphere. 
          Avoid close-ups of individuals unless they clearly consented. Images violating these guidelines will be removed.
        </p>
      </div>
    </div>
  );
}