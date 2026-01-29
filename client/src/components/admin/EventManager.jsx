import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EventManager() {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState('list');
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        dateType: 'single',
        startDate: '',
        endDate: '',
        recurringPattern: '',
        location: ''
    });
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [previews, setPreviews] = useState({ images: [], videos: [] });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
            setEvents(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            shortDescription: event.shortDescription || '',
            dateType: event.dateType || 'single',
            startDate: event.startDate ? event.startDate.split('T')[0] : '',
            endDate: event.endDate ? event.endDate.split('T')[0] : '',
            recurringPattern: event.recurringPattern || '',
            location: event.location || ''
        });
        setPreviews({
            images: event.images.map(url => ({ url, existing: true })),
            videos: event.videos.map(url => ({ url, existing: true }))
        });
        setImages([]);
        setVideos([]);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEvents();
        } catch (err) {
            alert('Error deleting event');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        if (editingEvent) {
            const existingImages = previews.images.filter(p => p.existing).map(p => p.url);
            const existingVideos = previews.videos.filter(p => p.existing).map(p => p.url);
            data.append('existingImages', JSON.stringify(existingImages));
            data.append('existingVideos', JSON.stringify(existingVideos));
        }

        // Append new files (use previews to preserve order)
        const orderedNewImages = previews.images.filter(p => !p.existing).map(p => p.file);
        orderedNewImages.forEach(f => data.append('images', f));

        videos.forEach(f => data.append('videos', f));

        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

            if (editingEvent) {
                await axios.put(`/api/events/${editingEvent._id}`, data, config);
            } else {
                await axios.post('/api/events', data, config);
            }

            setView('list');
            setEditingEvent(null);
            setFormData({ title: '', description: '', shortDescription: '', dateType: 'single', startDate: '', endDate: '', recurringPattern: '', location: '' });
            setPreviews({ images: [], videos: [] });
            setImages([]);
            setVideos([]);
            fetchEvents();
        } catch (err) {
            console.error(err);
            alert('Error saving event');
        } finally {
            setSubmitting(false);
        }
    };

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
                if (type === 'images') setImages(current => current.filter(f => f !== item.file));
                else setVideos(current => current.filter(f => f !== item.file));
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
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            shortDescription: '',
            dateType: 'single',
            startDate: '',
            endDate: '',
            recurringPattern: '',
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
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                    <button onClick={handleCreateNew} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">+ Add Event</button>
                </div>
                {loading ? <p>Loading...</p> : (
                    <div className="grid gap-4">
                        {events.map(ev => (
                            <div key={ev._id} className="border p-4 rounded-lg flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    {ev.images[0] && <img src={ev.images[0]} alt={ev.title} className="w-16 h-16 object-cover rounded" />}
                                    <div>
                                        <h3 className="font-bold">{ev.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(ev.startDate).toLocaleDateString()} {ev.dateType === 'range' ? `- ${new Date(ev.endDate).toLocaleDateString()}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(ev)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(ev._id)} className="text-red-600 hover:underline">Delete</button>
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
                <h2 className="text-2xl font-bold">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
                <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input type="text" required className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select className="w-full border p-2 rounded" value={formData.dateType} onChange={e => setFormData({ ...formData, dateType: e.target.value })}>
                            <option value="single">Single Date</option>
                            <option value="range">Date Range</option>
                            <option value="recurring">Recurring</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input type="date" required className="w-full border p-2 rounded" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                    </div>
                    {formData.dateType === 'range' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <input type="date" required className="w-full border p-2 rounded" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                        </div>
                    )}
                    {formData.dateType === 'recurring' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Pattern (e.g. Every Sunday)</label>
                            <input type="text" required className="w-full border p-2 rounded" value={formData.recurringPattern} onChange={e => setFormData({ ...formData, recurringPattern: e.target.value })} />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input type="text" className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Short Description</label>
                    <textarea className="w-full border p-2 rounded h-20" value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Full Description</label>
                    <ReactQuill theme="snow" value={formData.description} onChange={val => setFormData({ ...formData, description: val })} className="h-64 mb-12" />
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
                        {submitting ? 'Saving...' : 'Save Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EventManager;
