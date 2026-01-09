import { useState, useEffect } from 'react';

function MediaCarousel({ images = [], videos = [], baseUrl = 'http://localhost:5000', onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const allMedia = [
    ...images.map(img => ({ type: 'image', url: img })),
    ...videos.map(vid => ({ type: 'video', url: vid }))
  ];

  const minSwipeDistance = 50;

  useEffect(() => {
    setCurrentIndex(0);
  }, [images.length, videos.length]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < allMedia.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToPrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allMedia.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === allMedia.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex(index);
  };

  if (allMedia.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">No Media</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-gray-200"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Media Display */}
      <div className="relative w-full h-full" onClick={onImageClick ? (e) => onImageClick(e) : undefined}>
        {allMedia[currentIndex].type === 'image' ? (
          <img
            src={`${baseUrl}${allMedia[currentIndex].url}`}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
            }}
          />
        ) : (
          <video
            src={`${baseUrl}${allMedia[currentIndex].url}`}
            className="w-full h-full object-cover cursor-pointer"
            controls
            playsInline
            onClick={(e) => e.stopPropagation()} // Video controls shouldn't trigger navigation usually, but let's be safe or let native controls handle it.
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {allMedia.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all z-10"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all z-10"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {allMedia.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Media Type Indicator */}
      {allMedia.length > 1 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs z-10">
          {currentIndex + 1} / {allMedia.length}
        </div>
      )}
    </div>
  );
}

export default MediaCarousel;

