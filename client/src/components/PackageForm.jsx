import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function PackageForm({ package: pkg, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    featured: false,
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [days, setDays] = useState([]);

  useEffect(() => {
    if (pkg) {
      setFormData({
        title: pkg.title || '',
        description: pkg.description || '',
        price: pkg.price || '',
        featured: pkg.featured || false,
      });
      setDays(pkg.days || []);
      setExistingImages(pkg.images || []);
      setExistingVideos(pkg.videos || []);
    }
  }, [pkg]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayChange = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const addDay = () => {
    setDays([...days, { dayNumber: days.length + 1, title: '', description: '' }]);
  };

  const removeDay = (index) => {
    setDays(days.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 })));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create previews
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'image'
    }));
    setImagePreviews(previews);
  };

  const handleVideosChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);

    // Create previews
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'video'
    }));
    setVideoPreviews(previews);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index) => {
    setExistingVideos(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    const preview = imagePreviews[index];
    URL.revokeObjectURL(preview.preview);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
    const preview = videoPreviews[index];
    URL.revokeObjectURL(preview.preview);
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate that at least one image or video exists
    const totalMedia = existingImages.length + existingVideos.length + images.length + videos.length;
    if (totalMedia === 0) {
      setError('At least one image or video is required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('featured', formData.featured);
      data.append('days', JSON.stringify(days));

      // Append existing media arrays
      data.append('existingImages', JSON.stringify(existingImages));
      data.append('existingVideos', JSON.stringify(existingVideos));

      // Append new files
      images.forEach((image) => {
        data.append('images', image);
      });
      videos.forEach((video) => {
        data.append('videos', video);
      });

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (pkg) {
        await axios.put(`/api/packages/${pkg._id}`, data, config);
      } else {
        await axios.post('/api/packages', data, config);
      }

      // Clean up preview URLs
      [...imagePreviews, ...videoPreviews].forEach(preview => {
        URL.revokeObjectURL(preview.preview);
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving package');
    } finally {
      setLoading(false);
    }
  };

  const allMedia = [
    ...existingImages.map(img => ({ type: 'image', url: img, existing: true })),
    ...existingVideos.map(vid => ({ type: 'video', url: vid, existing: true })),
    ...imagePreviews.map(preview => ({ type: 'image', preview: preview.preview, existing: false })),
    ...videoPreviews.map(preview => ({ type: 'video', preview: preview.preview, existing: false }))
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        {pkg ? 'Edit Package' : 'Create New Package'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <div className="bg-white">
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
              className="h-64 mb-12"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['link', 'clean']
                ],
              }}
            />
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Itinerary</h3>
            <button
              type="button"
              onClick={addDay}
              className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 text-sm font-medium"
            >
              + Add Day
            </button>
          </div>

          <div className="space-y-6">
            {days.map((day, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 relative border border-gray-200">
                <button
                  type="button"
                  onClick={() => removeDay(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                <h4 className="font-medium text-gray-700 mb-4">Day {day.dayNumber}</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day Title
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleDayChange(index, 'title', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Arrival & Welcome Dinner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day Description
                    </label>
                    <div className="bg-white">
                      <ReactQuill
                        theme="snow"
                        value={day.description}
                        onChange={(content) => handleDayChange(index, 'description', content)}
                        className="h-40 mb-10"
                        modules={{
                          toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['clean']
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {days.length === 0 && (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No itinerary days added yet. Click "Add Day" to create an itinerary.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Featured Package
              </span>
            </label>
          </div>
        </div>

        {/* Media Upload Section */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images {!pkg && '*'}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can select multiple images
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Videos
            </label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideosChange}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can select multiple videos (MP4, WebM, etc.)
            </p>
          </div>

          {/* Media Preview */}
          {allMedia.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Media Preview ({allMedia.length} {allMedia.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images:</h4>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`http://localhost:5000${img}`}
                          alt={`Existing ${index + 1}`}
                          className="w-24 h-24 object-cover rounded border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Videos */}
              {existingVideos.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Videos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {existingVideos.map((vid, index) => (
                      <div key={index} className="relative group">
                        <video
                          src={`http://localhost:5000${vid}`}
                          className="w-24 h-24 object-cover rounded border border-gray-300"
                          muted
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingVideo(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">New Images:</h4>
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.preview}
                          alt={`New ${index + 1}`}
                          className="w-24 h-24 object-cover rounded border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Videos */}
              {videoPreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">New Videos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {videoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <video
                          src={preview.preview}
                          className="w-24 h-24 object-cover rounded border border-gray-300"
                          muted
                        />
                        <button
                          type="button"
                          onClick={() => removeNewVideo(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : pkg ? 'Update Package' : 'Create Package'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PackageForm;
