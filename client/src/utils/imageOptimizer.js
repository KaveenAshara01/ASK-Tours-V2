/**
 * Optimizes Cloudinary URLs by adding auto-format, auto-quality, and resize transformations.
 * @param {string} url - The original image URL
 * @param {number} [width] - Optional width to resize to
 * @returns {string} - The optimized URL
 */
export const optimizeImage = (url, width) => {
    if (!url) return '';
    if (typeof url !== 'string') return url;

    // Only optimize Cloudinary URLs
    if (!url.includes('cloudinary.com')) return url;

    // Check if simple upload URL structure exists
    const splitToken = '/upload/';
    const parts = url.split(splitToken);

    if (parts.length < 2) return url;

    let transformations = 'f_auto,q_auto';
    if (width) {
        transformations += `,w_${width}`;
    }

    // Reassemble: Base + /upload/ + transformations + / + Rest
    return `${parts[0]}${splitToken}${transformations}/${parts[1]}`;
};
