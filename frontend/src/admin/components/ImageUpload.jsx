import { useState } from 'react';
import adminApi from '../services/adminApi';

export default function ImageUpload({ 
  onUploadComplete,          // called with the uploaded file URL or object
  existingImage = null,      // url string or null
  label = "Upload Image",
  accept = "image/*"
}) {
  const [preview, setPreview] = useState(existingImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);   // most of your endpoints expect 'image'

    try {
      // We will actually upload when the whole form is submitted → here we just preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onUploadComplete(file);           // pass the File object to parent form
    } catch (err) {
      setError('Failed to prepare image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full object-cover rounded-xl border border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={() => { setPreview(null); onUploadComplete(null); }}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            {uploading ? 'Preparing...' : 'Click to upload or drag & drop'}
          </label>
          <p className="text-xs text-gray-500 mt-2">PNG, JPG, max 5MB recommended</p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}