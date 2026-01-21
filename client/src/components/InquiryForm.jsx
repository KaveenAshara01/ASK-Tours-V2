import { useState, useEffect } from 'react';
import axios from 'axios';

import { countryData } from '../constants/countryData';

export default function InquiryForm({ initialNote = '', className = '', embedded = false }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        destination: '', // Maps to Note/Destination
        arrivalDate: '',
        isDateNotConfirmed: false,
        adults: 2,
        children: 0,
        toddlers: 0,
        email: '',
        whatsappNumber: '',
        connectOnWhatsapp: false
    });

    useEffect(() => {
        if (initialNote) {
            setFormData(prev => ({ ...prev, destination: initialNote }));
        }
    }, [initialNote]);

    const [countryCode, setCountryCode] = useState('+94');

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

        // Concatenate Country Code with Number if WhatsApp is selected
        const finalWhatsappNumber = formData.whatsappNumber
            ? `${countryCode} ${formData.whatsappNumber}`.replace(/\s+/g, '')
            : '';

        const payload = {
            ...formData,
            email: formData.connectOnWhatsapp ? (formData.email || '') : formData.email, // Allow empty email if WhatsApp
            whatsappNumber: finalWhatsappNumber,
            arrivalDate: formData.arrivalDate,
            travelers: {
                adults: Number(formData.adults),
                children: Number(formData.children),
                toddlers: Number(formData.toddlers)
            },
            note: formData.destination // Note simplified, backend handles labeling
        };

        try {
            const response = await axios.post('/api/inquiries', payload);
            if (response.data.success) {
                setStatus('success');
                // Removed alert as requested

                // Reset form fields
                setFormData(prev => ({
                    ...prev,
                    name: '',
                    destination: '',
                    email: '',
                    arrivalDate: '',
                    whatsappNumber: ''
                }));

                // Reset button after 3 seconds
                setTimeout(() => {
                    setStatus(null);
                }, 3000);
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
        <div className={`w-full max-w-4xl mx-auto ${embedded ? '' : 'p-2'} ${className}`}>
            <form
                onSubmit={handleSubmit}
                className={`bg-white flex flex-col gap-4 ${embedded ? '' : 'rounded-[2rem] shadow-2xl border border-gray-100 p-6'}`}
            >
                {/* Row 1: Destination & Date */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-gray-100">
                    {/* Name Field - New */}
                    <div className="md:col-span-12 flex flex-col justify-center px-2 mb-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Your Name</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium bg-transparent"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Where - Location/Note */}
                    <div className="md:col-span-8 flex flex-col justify-center px-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Include a Note / Destination</label>
                        <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all h-24">
                            <svg className="w-5 h-5 text-primary-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <textarea
                                name="destination"
                                placeholder="I want to go to Kandy, Nuwara Eliya... (Add any specific requests here)"
                                className="w-full h-full outline-none text-gray-700 placeholder-gray-400 text-sm font-medium bg-transparent resize-none py-1"
                                value={formData.destination}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* When - Date */}
                    <div className="md:col-span-4 flex flex-col justify-center px-2">
                        <div className="flex justify-between items-center mb-1 ml-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Arrival Date</label>
                            <label className="flex items-center gap-1 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    checked={formData.isDateNotConfirmed}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            isDateNotConfirmed: e.target.checked,
                                            arrivalDate: e.target.checked ? '' : prev.arrivalDate
                                        }));
                                    }}
                                    className="w-3 h-3 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                                />
                                <span className="text-[10px] text-gray-400 group-hover:text-primary-600 transition-colors font-semibold uppercase">Not Confirmed</span>
                            </label>
                        </div>
                        <div className={`flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all ${formData.isDateNotConfirmed ? 'opacity-50 grayscale' : ''}`}>
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <input
                                type="date"
                                name="arrivalDate"
                                className={`w-full outline-none text-gray-700 text-sm font-medium bg-transparent ${formData.isDateNotConfirmed ? 'cursor-not-allowed' : ''}`}
                                value={formData.arrivalDate}
                                onChange={(e) => {
                                    handleDateChange(e);
                                    if (e.target.value) {
                                        setFormData(prev => ({ ...prev, isDateNotConfirmed: false }));
                                    }
                                }}
                                disabled={formData.isDateNotConfirmed}
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
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            )}

                            {formData.connectOnWhatsapp && (
                                <div className="relative border-r border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="h-full px-3 flex items-center gap-2 hover:bg-gray-50 transition-colors bg-transparent outline-none"
                                    >
                                        {/* Show Flag Image if available, else emoji fallback or globe */}
                                        {(() => {
                                            const selectedCountry = countryData.find(c => c.dial_code === countryCode);
                                            if (selectedCountry) {
                                                return (
                                                    <img
                                                        src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                                                        srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
                                                        width="24"
                                                        height="16"
                                                        alt={selectedCountry.name}
                                                        className="rounded-[2px] object-cover"
                                                    />
                                                );
                                            }
                                            return <span className="text-lg">🌍</span>;
                                        })()}

                                        <span className="text-sm font-bold text-gray-700">{countryCode}</span>
                                        <svg className={`w-3 h-3 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>

                                    {showCountryDropdown && (
                                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowCountryDropdown(false)}>
                                            <div
                                                className="bg-white rounded-2xl w-full max-w-sm max-h-[60vh] flex flex-col shadow-2xl animate-scaleIn overflow-hidden"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                                    <h3 className="font-bold text-gray-700">Select Country</h3>
                                                    <button onClick={() => setShowCountryDropdown(false)} className="p-1 hover:bg-gray-200 rounded-full">
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                                <div className="p-2 border-b border-gray-100 bg-white">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter country code..."
                                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-gray-50"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="overflow-y-auto flex-1 p-2">
                                                    {countryData.filter(c =>
                                                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                        c.dial_code.includes(searchQuery)
                                                    ).map((country) => (
                                                        <button
                                                            key={country.code}
                                                            type="button"
                                                            onClick={() => {
                                                                setCountryCode(country.dial_code);
                                                                setShowCountryDropdown(false);
                                                                setSearchQuery('');
                                                            }}
                                                            className="w-full text-left px-4 py-3 hover:bg-primary-50 rounded-xl flex items-center gap-4 transition-colors mb-1"
                                                        >
                                                            <img
                                                                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                                srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                                                                width="24"
                                                                height="16"
                                                                alt={country.name}
                                                                className="rounded-[2px] object-cover"
                                                                loading="lazy"
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-gray-800">{country.name}</span>
                                                                <span className="text-xs text-gray-500 font-medium">{country.dial_code}</span>
                                                            </div>
                                                            {countryCode === country.dial_code && (
                                                                <svg className="w-5 h-5 text-primary-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            )}
                                                        </button>
                                                    ))}
                                                    {countryData.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.dial_code.includes(searchQuery)).length === 0 && (
                                                        <div className="p-8 text-center text-gray-400">
                                                            <p className="text-sm">No countries found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <input
                                type={formData.connectOnWhatsapp ? "text" : "email"}
                                name={formData.connectOnWhatsapp ? "whatsappNumber" : "email"}
                                placeholder={formData.connectOnWhatsapp ? "Phone Number" : "Email Address"}
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
                            disabled={loading || status === 'success'}
                            className={`w-full font-bold rounded-xl py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 ${status === 'success'
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-primary-600 hover:bg-primary-700 text-white'
                                }`}
                        >
                            {loading ? (
                                <span>Sending...</span>
                            ) : status === 'success' ? (
                                <>
                                    <span>Sent!</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <span>Inquire Now</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
