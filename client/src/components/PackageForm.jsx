import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Standalone Map Click Handler Component
function RouteBuilderMap({ stops, onStopAdd, onMapClick, onMapMove }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
    zoomend(e) {
      onMapMove([e.target.getCenter().lat, e.target.getCenter().lng]);
    },
    moveend(e) {
      onMapMove([e.target.getCenter().lat, e.target.getCenter().lng]);
    }
  });

  return (
    <>
      {stops.map((stop, index) => (
        <Marker key={stop.id || index} position={[stop.lat, stop.lng]}>
          <Popup>{index + 1}. {stop.name}</Popup>
        </Marker>
      ))}
      <Polyline
        positions={stops.map(s => [s.lat, s.lng])}
        color="#2563eb"
        weight={4}
        opacity={0.7}
        dashArray="10, 10"
      />
    </>
  );
}

function PackageForm({ package: pkg, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    description: '',
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
  const [stops, setStops] = useState([]); // Array of { lat, lng, name, id }
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [categories, setCategories] = useState([]); // All available categories
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected category IDs

  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    fetchMetaData();
  }, []);

  const fetchMetaData = async () => {
    try {
      const [catRes, actRes, evtRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/activities'),
        axios.get('/api/events')
      ]);
      setCategories(catRes.data);
      setActivities(actRes.data);
      setEvents(evtRes.data);
    } catch (error) {
      console.error('Error fetching meta data:', error);
    }
  };

  useEffect(() => {
    if (pkg) {
      setFormData({
        title: pkg.title || '',
        duration: pkg.duration || '',
        description: pkg.description || '',
        featured: pkg.featured || false,
      });
      setDays(pkg.days || []);
      setStops(pkg.stops || []);
      setExistingImages(pkg.images || []);
      setExistingVideos(pkg.videos || []);

      const catIds = pkg.categories ? pkg.categories.map(c => typeof c === 'object' ? c._id : c) : [];
      setSelectedCategories(catIds);

      const actIds = pkg.activities ? pkg.activities.map(a => typeof a === 'object' ? a._id : a) : [];
      setSelectedActivities(actIds);

      const evtIds = pkg.events ? pkg.events.map(e => typeof e === 'object' ? e._id : e) : [];
      setSelectedEvents(evtIds);
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

  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]); // Default: Colombo, Sri Lanka

  // Search Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=lk&limit=10`);
          setSearchResults(response.data);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500); // Reduced to 500ms for better responsiveness

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleMapClick = async (latlng) => {
    try {
      // Reverse geocode to get name
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const displayName = response.data.display_name;
      // Extract a simpler name (First part is usually specific)
      const simpleName = displayName.split(',')[0];

      const newStop = {
        lat: latlng.lat,
        lng: latlng.lng,
        name: simpleName || 'Selected Location',
        id: Date.now().toString()
      };
      setStops(prev => [...prev, newStop]);
    } catch (error) {
      console.error("Reverse geocoding failed", error);
      // Fallback if reverse geocode fails
      const newStop = {
        lat: latlng.lat,
        lng: latlng.lng,
        name: 'Pinned Location',
        id: Date.now().toString()
      };
      setStops(prev => [...prev, newStop]);
    }
  };

  const addStop = (location) => {
    const newStop = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
      name: location.display_name.split(',')[0], // Simplified name
      id: Date.now().toString()
    };
    setStops([...stops, newStop]);
    setMapCenter([newStop.lat, newStop.lng]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
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
      data.append('duration', formData.duration);
      data.append('description', formData.description);
      data.append('featured', formData.featured);
      data.append('days', JSON.stringify(days));
      data.append('stops', JSON.stringify(stops));
      data.append('categories', JSON.stringify(selectedCategories));
      data.append('activities', JSON.stringify(selectedActivities));
      data.append('events', JSON.stringify(selectedEvents));

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
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. 5 Days / 4 Nights"
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

        {/* Route Builder Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Route Map</h3>
          <p className="text-sm text-gray-500 mb-4">Search for locations OR click explicitly on the map to add stops.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 h-96 rounded-lg overflow-hidden border border-gray-300 z-0 relative">
              <MapContainer
                center={mapCenter}
                zoom={8}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RouteBuilderMap
                  stops={stops}
                  onMapClick={handleMapClick}
                  onMapMove={setMapCenter}
                />
              </MapContainer>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Location</label>
                <input
                  type="text"
                  placeholder="Type to search (e.g. Ella)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                />
                {isSearching && <div className="absolute right-3 top-9 text-gray-400 text-xs">Searching...</div>}

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                    {searchResults.map((result, idx) => (
                      <li
                        key={idx}
                        onClick={() => addStop(result)}
                        className="px-4 py-2 hover:bg-primary-50 cursor-pointer text-sm border-b last:border-b-0"
                      >
                        <div className="font-medium text-gray-800">{result.display_name.split(',')[0]}</div>
                        <div className="text-xs text-gray-500 truncate">{result.display_name}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Stops List */}
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-gray-700 mb-2">Route Stops ({stops.length})</h4>
                {stops.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No stops added yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {stops.map((stop, index) => (
                      <li key={stop.id || index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary-100 text-primary-700 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-800">{stop.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStop(index)}
                          className="text-red-500 hover:text-red-700 text-xs px-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(cat => (
              <label key={cat._id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedCategories([...selectedCategories, cat._id]);
                    else setSelectedCategories(selectedCategories.filter(id => id !== cat._id));
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 font-medium">{cat.name}</span>
              </label>
            ))}
            {categories.length === 0 && <p className="text-sm text-gray-500 col-span-full">No categories available.</p>}
          </div>
        </div>

        {/* Activities Section */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Activities (Experiences)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activities.map(act => (
              <label key={act._id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(act._id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedActivities([...selectedActivities, act._id]);
                    else setSelectedActivities(selectedActivities.filter(id => id !== act._id));
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 font-medium">{act.title}</span>
              </label>
            ))}
            {activities.length === 0 && <p className="text-sm text-gray-500 col-span-full">No activities available. Create some in Activity Manager.</p>}
          </div>
        </div>

        {/* Events Section */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Events
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {events.map(ev => (
              <label key={ev._id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(ev._id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedEvents([...selectedEvents, ev._id]);
                    else setSelectedEvents(selectedEvents.filter(id => id !== ev._id));
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="block text-gray-700 font-medium">{ev.title}</span>
                  <span className="block text-xs text-gray-500">{new Date(ev.startDate).toLocaleDateString()}</span>
                </div>
              </label>
            ))}
            {events.length === 0 && <p className="text-sm text-gray-500 col-span-full">No events available. Create some in Event Manager.</p>}
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

        <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-6">


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
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images (Drag to Reorder):</h4>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative group cursor-move transition-transform active:scale-95"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', index);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault(); // Essential for onDrop to fire
                          e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
                          if (sourceIndex === index || isNaN(sourceIndex)) return;

                          const newImages = [...existingImages];
                          const [movedImage] = newImages.splice(sourceIndex, 1);
                          newImages.splice(index, 0, movedImage);
                          setExistingImages(newImages);
                        }}
                      >
                        <img
                          src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                          alt={`Existing ${index + 1}`}
                          className="w-24 h-24 object-cover rounded border border-gray-300 hover:border-primary-500 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 hover:bg-red-600 z-10"
                          title="Delete Image"
                        >
                          ×
                        </button>
                        {/* Drag Indicator Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[10px] text-center opacity-0 group-hover:opacity-100 pointer-events-none rounded-b">
                          Cover: #{index + 1}
                        </div>
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
                          src={vid.startsWith('http') ? vid : `http://localhost:5000${vid}`}
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
      </form >
    </div >
  );
}

export default PackageForm;
