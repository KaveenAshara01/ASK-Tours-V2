import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InquiryBar({ className = '' }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [formData, setFormData] = useState({
        destination: '', // Maps to Note
        arrivalDate: '',
        isDateNotConfirmed: true,
        adults: 2,
        children: 0,
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        const val = e.target.value;
        setFormData(prev => ({
            ...prev,
            arrivalDate: val,
            isDateNotConfirmed: !val
        }));
    };

    const handleTravelerChange = (type, val) => {
        setFormData(prev => ({ ...prev, [type]: Math.max(0, val) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Construct payload matching Inquiry model
        const payload = {
            email: formData.email,
            arrivalDate: formData.arrivalDate,
            isDateNotConfirmed: formData.isDateNotConfirmed,
            travelers: {
                adults: formData.adults,
                children: formData.children,
                toddlers: 0
            },
            note: `I want to go to: ${formData.destination}`,
            connectOnWhatsapp: false
        };

        try {
            const response = await axios.post('/api/inquiries', payload);
            if (response.data.success) {
                setStatus('success');
                alert('Inquiry Sent! We will contact you shortly.');
                setFormData(prev => ({ ...prev, destination: '', email: '', arrivalDate: '' }));
            }
        } catch (error) {
            console.error('Inquiry Error:', error);
            setStatus('error');
            alert('Failed to send. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`w-full max-w-4xl mx-auto ${className}`}>
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 flex flex-col gap-4"
            >
                {/* Row 1: Destination & Date */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-gray-100">
                    {/* Where - Location/Note */}
                    <div className="md:col-span-8 flex flex-col justify-center px-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Include a Note / Destination</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <input
                                type="text"
                                name="destination"
                                placeholder="I want to go to Kandy, Nuwara Eliya..."
                                className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium bg-transparent"
                                value={formData.destination}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* When - Date */}
                    <div className="md:col-span-4 flex flex-col justify-center px-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Arrival Date</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <input
                                type="date"
                                name="arrivalDate"
                                className="w-full outline-none text-gray-700 text-sm font-medium bg-transparent"
                                value={formData.arrivalDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Row 2: Travelers, Contact, Button */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                    {/* Who - Travelers */}
                    <div className="md:col-span-4 flex flex-col justify-center px-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Travelers</label>
                        <div className="flex items-center justify-between gap-1 bg-gray-50 rounded-xl px-2 py-2 border border-gray-100">
                            {/* Adults */}
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 font-semibold uppercase">Adults</span>
                                <div className="flex items-center">
                                    <button type="button" onClick={() => handleTravelerChange('adults', formData.adults - 1)} className="text-gray-400 hover:text-primary-600 px-1">-</button>
                                    <input type="text" readOnly className="w-4 text-center bg-transparent text-sm font-bold text-gray-700" value={formData.adults} />
                                    <button type="button" onClick={() => handleTravelerChange('adults', formData.adults + 1)} className="text-gray-400 hover:text-primary-600 px-1">+</button>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            {/* Kids */}
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 font-semibold uppercase">Kids</span>
                                <div className="flex items-center">
                                    <button type="button" onClick={() => handleTravelerChange('children', formData.children - 1)} className="text-gray-400 hover:text-primary-600 px-1">-</button>
                                    <input type="text" readOnly className="w-4 text-center bg-transparent text-sm font-bold text-gray-700" value={formData.children} />
                                    <button type="button" onClick={() => handleTravelerChange('children', formData.children + 1)} className="text-gray-400 hover:text-primary-600 px-1">+</button>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            {/* Toddlers */}
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 font-semibold uppercase">Toddlers</span>
                                <div className="flex items-center">
                                    <button type="button" onClick={() => handleTravelerChange('toddlers', formData.toddlers - 1)} className="text-gray-400 hover:text-primary-600 px-1">-</button>
                                    <input type="text" readOnly className="w-4 text-center bg-transparent text-sm font-bold text-gray-700" value={formData.toddlers} />
                                    <button type="button" onClick={() => handleTravelerChange('toddlers', formData.toddlers + 1)} className="text-gray-400 hover:text-primary-600 px-1">+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact - Email/WhatsApp */}
                    <div className="md:col-span-5 flex flex-col justify-center px-2">
                        <div className="flex items-center justify-between mb-1 ml-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</label>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, connectOnWhatsapp: !prev.connectOnWhatsapp }))}
                                className="text-[10px] font-bold text-primary-600 hover:underline flex items-center gap-1"
                            >
                                {formData.connectOnWhatsapp ? 'Switch to Email' : 'Switch to WhatsApp'}
                            </button>
                        </div>
                        <div className={`flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 transition-all ${formData.connectOnWhatsapp ? 'focus-within:ring-green-100' : 'focus-within:ring-blue-100'}`}>
                            {formData.connectOnWhatsapp ? (
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            )}
                            <input
                                type={formData.connectOnWhatsapp ? "text" : "email"}
                                name={formData.connectOnWhatsapp ? "whatsappNumber" : "email"}
                                placeholder={formData.connectOnWhatsapp ? "WhatsApp Number" : "Email Address"}
                                className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium bg-transparent"
                                value={formData.connectOnWhatsapp ? (formData.whatsappNumber || '') : (formData.email || '')}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-secondary-500 hover:text-primary-950 text-white font-bold rounded-xl py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <span>{loading ? 'Sending...' : 'Inquire Now'}</span>
                            {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
