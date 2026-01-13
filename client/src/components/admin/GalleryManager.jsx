import { useState, useEffect } from 'react';
import axios from 'axios';

function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get('/api/gallery');
            setImages(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch images');
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/gallery', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clear selection and refresh
            setSelectedFiles([]);
            setPreviews([]);
            fetchImages();
            setUploading(false);
        } catch (err) {
            setError('Upload failed: ' + (err.response?.data?.message || err.message));
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/gallery/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setImages(images.filter(img => img._id !== id));
        } catch (err) {
            alert('Failed to delete image');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gallery Management</h2>

            {/* Upload Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="flex flex-col items-center justify-center">
                        <label className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition shadow-sm font-medium text-gray-700">
                            Select Images to Upload
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG, WEBP (Max 5MB)</p>
                    </div>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                            {previews.map((src, idx) => (
                                <img key={idx} src={src} alt="Preview" className="w-full h-24 object-cover rounded-lg border" />
                            ))}
                        </div>
                    )}

                    {selectedFiles.length > 0 && (
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-medium"
                            >
                                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Images`}
                            </button>
                        </div>
                    )}
                </form>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="text-center py-10">Loading gallery...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(img => (
                        <div key={img._id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg transform hover:scale-110"
                                    title="Delete Image"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">No images in gallery yet.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GalleryManager;
