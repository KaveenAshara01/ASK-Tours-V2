import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [contentImageFile, setContentImageFile] = useState(null);
    const [contentPreviewUrl, setContentPreviewUrl] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        coverImage: '',
        contentImage: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleContentFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setContentImageFile(file);
            setContentPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        // Use FormData for file upload
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);

        if (imageFile) {
            data.append('coverImage', imageFile);
        } else if (formData.coverImage) {
            data.append('coverImage', formData.coverImage);
        }

        if (contentImageFile) {
            data.append('contentImage', contentImageFile);
        } else if (formData.contentImage) {
            data.append('contentImage', formData.contentImage);
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editingCategory) {
                await axios.put(`/api/categories/${editingCategory._id}`, data, config);
            } else {
                await axios.post('/api/categories', data, config);
            }

            resetForm();
            fetchCategories();
        } catch (error) {
            alert('Error saving category: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            coverImage: category.coverImage || '',
            contentImage: category.contentImage || ''
        });
        setPreviewUrl(category.coverImage || '');
        setContentPreviewUrl(category.contentImage || '');
        setImageFile(null);
        setContentImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (error) {
            alert('Error deleting category');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', coverImage: '', contentImage: '' });
        setEditingCategory(null);
        setImageFile(null);
        setContentImageFile(null);
        if (previewUrl && !previewUrl.startsWith('/')) {
            URL.revokeObjectURL(previewUrl);
        }
        if (contentPreviewUrl && !contentPreviewUrl.startsWith('/')) {
            URL.revokeObjectURL(contentPreviewUrl);
        }
        setPreviewUrl('');
        setContentPreviewUrl('');
        setShowForm(false);
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Categories</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                    {showForm ? 'Close Form' : '+ Add Category'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 ring-1 ring-gray-100">
                    <h3 className="text-lg font-bold mb-4">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <div className="bg-white">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={handleDescriptionChange}
                                    className="h-40 mb-12"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cover Image (Hero)</label>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Upload a hero cover image (Max 10MB)</p>
                                </div>
                                {previewUrl && (
                                    <div className="flex-shrink-0 relative h-20 w-32 border rounded overflow-hidden">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content Background Image (Blurry)</label>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleContentFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Upload a background image for the list section (Max 10MB)</p>
                                </div>
                                {contentPreviewUrl && (
                                    <div className="flex-shrink-0 relative h-20 w-32 border rounded overflow-hidden">
                                        <img src={contentPreviewUrl} alt="Content Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                                Save Category
                            </button>
                            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                    <div key={category._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition">
                        {category.coverImage && (
                            <div className="h-40 overflow-hidden">
                                <img
                                    src={category.coverImage}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                            </div>
                        )}
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                            <div
                                className="text-gray-500 text-sm mt-1 mb-4 line-clamp-2 prose prose-sm"
                                dangerouslySetInnerHTML={{ __html: category.description }}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="text-primary-600 hover:text-primary-800 text-sm font-semibold px-2 py-1"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && !loading && (
                    <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        No categories found. Create one above!
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryManager;
