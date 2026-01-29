import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function ActivityManager() {
    const [activities, setActivities] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingActivity, setEditingActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        price: '',
        location: ''
    });
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [previews, setPreviews] = useState({ images: [], videos: [] });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await axios.get('/api/activities');
            setActivities(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setFormData({
            title: activity.title,
            description: activity.description,
            shortDescription: activity.shortDescription || '',
            price: activity.price || '',
            location: activity.location || ''
        });
        setPreviews({
            images: activity.images.map(url => ({ url, existing: true })),
            videos: activity.videos.map(url => ({ url, existing: true }))
        });
        setImages([]); // clear new uploads
        setVideos([]);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this activity?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/activities/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchActivities();
        } catch (err) {
            alert('Error deleting activity');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        // Handle existing media for updates
        if (editingActivity) {
            const existingImages = previews.images.filter(p => p.existing).map(p => p.url);
            const existingVideos = previews.videos.filter(p => p.existing).map(p => p.url);
            data.append('existingImages', JSON.stringify(existingImages));
            data.append('existingVideos', JSON.stringify(existingVideos));
        }

        // Append new files (use previews to preserve order)
        const orderedNewImages = previews.images.filter(p => !p.existing).map(p => p.file);
        orderedNewImages.forEach(f => data.append('images', f));

        videos.forEach(f => data.append('videos', f)); // Videos kept simple for now

        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

            if (editingActivity) {
                await axios.put(`/api/activities/${editingActivity._id}`, data, config);
            } else {
                await axios.post('/api/activities', data, config);
            }

            setView('list');
            setEditingActivity(null);
            setFormData({ title: '', description: '', shortDescription: '', price: '', location: '' });
            setPreviews({ images: [], videos: [] });
            setImages([]);
            setVideos([]);
            fetchActivities();
        } catch (err) {
            console.error(err);
            alert('Error saving activity');
        } finally {
            setSubmitting(false);
        }
    };

    // File handlers
    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (type === 'image') setImages([...images, ...files]);
        else setVideos([...videos, ...files]);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            existing: false,
            file
        }));

        setPreviews(prev => ({
            ...prev,
            [type === 'image' ? 'images' : 'videos']: [...prev[type === 'image' ? 'images' : 'videos'], ...newPreviews]
        }));
    };

    const removePreview = (type, index) => {
        setPreviews(prev => {
            const list = [...prev[type]];
            const item = list[index];
            if (!item.existing) {
                // Remove from file state
                if (type === 'images') {
                    setImages(current => current.filter(f => f !== item.file));
                } else {
                    setVideos(current => current.filter(f => f !== item.file));
                }
            }
            list.splice(index, 1);
            return { ...prev, [type]: list };
        });
    };

    // Drag and Drop Handlers
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (sourceIndex === targetIndex || isNaN(sourceIndex)) return;

        setPreviews(prev => {
            const newImages = [...prev.images];
            const [movedItem] = newImages.splice(sourceIndex, 1);
            newImages.splice(targetIndex, 0, movedItem);
            return { ...prev, images: newImages };
        });
    };

    const handleCreateNew = () => {
        setEditingActivity(null);
        setFormData({
            title: '',
            description: '',
            shortDescription: '',
            price: '',
            location: ''
        });
        setPreviews({ images: [], videos: [] });
        setImages([]);
        setVideos([]);
        setView('form');
    };

    if (view === 'list') {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Activities</h2>
                    <button
                        onClick={handleCreateNew}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        + Add Activity
                    </button>
                </div>
                {loading ? <p>Loading...</p> : (
                    <div className="grid gap-4">
                        {activities.map(act => (
                            <div key={act._id} className="border p-4 rounded-lg flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    {act.images[0] && <img src={act.images[0]} alt={act.title} className="w-16 h-16 object-cover rounded" />}
                                    <div>
                                        <h3 className="font-bold">{act.title}</h3>
                                        <p className="text-sm text-gray-500">{act.location}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(act)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(act._id)} className="text-red-600 hover:underline">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">{editingActivity ? 'Edit Activity' : 'New Activity'}</h2>
                <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-2 rounded"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (Optional)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Short Description</label>
                        <textarea
                            className="w-full border p-2 rounded h-20"
                            value={formData.shortDescription}
                            onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Full Description</label>
                    <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={val => setFormData({ ...formData, description: val })}
                        className="h-64 mb-12"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Images (Drag to Reorder)</label>
                        <input type="file" multiple accept="image/*" onChange={e => handleFileChange(e, 'image')} className="mb-2" />
                        <div className="flex flex-wrap gap-2">
                            {previews.images.map((p, i) => (
                                <div
                                    key={i}
                                    className="relative w-24 h-24 group cursor-move"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, i)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, i)}
                                >
                                    <img
                                        src={p.url}
                                        className="w-full h-full object-cover rounded border border-gray-200 group-hover:border-primary-500 transition-colors"
                                        alt={`Preview ${i}`}
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                                    <button
                                        type="button"
                                        onClick={() => removePreview('images', i)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        x
                                    </button>
                                    <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                        {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Videos</label>
                        <input type="file" multiple accept="video/*" onChange={e => handleFileChange(e, 'video')} className="mb-2" />
                        <div className="flex flex-wrap gap-2">
                            {previews.videos.map((p, i) => (
                                <div key={i} className="relative w-24 h-24 bg-black">
                                    <video src={p.url} className="w-full h-full object-cover rounded border" />
                                    <button type="button" onClick={() => removePreview('videos', i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">x</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button type="button" onClick={() => setView('list')} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">
                        {submitting ? 'Saving...' : 'Save Activity'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ActivityManager;
