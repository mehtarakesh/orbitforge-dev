'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Grid, Zap, AlertCircle } from 'lucide-react';

const ImageManagementEpic: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/images');
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Image Management</h1>

      {/* Upload Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Images
        </h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            📤 Upload Single Image
          </button>
          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            📤 Batch Upload (100+)
          </button>
          <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
            📤 Upload from URL
          </button>
          <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
            🔄 Sync from Unsplash
          </button>
        </div>
      </div>

      {/* Gallery & Processing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Image Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.slice(0, 6).map((image, idx) => (
              <ImageThumbnail key={idx} image={image} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Showing {Math.min(6, images.length)} of {images.length} images
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="font-bold mb-3">Image Processing</h3>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors mb-2">
              🔄 Auto-resize All
            </button>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors mb-2">
              🎨 Auto-optimize Quality
            </button>
            <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-xs font-medium transition-colors">
              🔍 Detect Blurry
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="font-bold mb-3">CDN Cache</h3>
            <p className="text-xs text-gray-400 mb-3">
              <span className="text-green-400">✓</span> Cache Active<br />
              <span className="text-blue-400">45,234</span> Cached<br />
              <span className="text-green-400">94%</span> Hit Rate
            </p>
            <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors">
              🔄 Purge Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageThumbnail: React.FC<{ image: any }> = ({ image }) => (
  <div className="bg-gray-700 rounded-lg overflow-hidden group cursor-pointer hover:opacity-80 transition-opacity">
    <div className="aspect-square bg-gray-600 flex items-center justify-center">
      <span className="text-3xl">📷</span>
    </div>
    <div className="p-2 text-xs">
      <p className="truncate font-medium">{image.name}</p>
      <p className="text-gray-400">{image.size}</p>
    </div>
  </div>
);

export default ImageManagementEpic;
