import MediaCarousel from './MediaCarousel';

function PackageList({ packages, onEdit, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-600">
          No packages yet. Create your first package!
        </div>
      ) : (
        packages.map((pkg) => {
          // Backward compatibility: if old image field exists, convert it to images array
          const images = pkg.images && pkg.images.length > 0
            ? pkg.images
            : pkg.image
              ? [pkg.image]
              : [];
          const videos = pkg.videos || [];

          return (
            <div key={pkg._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
              <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={() => window.location.href = `/package/${pkg._id}`}>
                <MediaCarousel
                  images={images}
                  videos={videos}
                  baseUrl="http://localhost:5000"
                />
                {pkg.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold z-20">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3
                  className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => window.location.href = `/package/${pkg._id}`}
                >
                  {pkg.title}
                </h3>
                <div
                  className="text-gray-600 text-sm mb-3 line-clamp-2 cursor-pointer"
                  onClick={() => window.location.href = `/package/${pkg._id}`}
                  dangerouslySetInnerHTML={{ __html: pkg.description }} /* Show snippet of request description if desired, or keep as is. Actually description is now HTML from Quill. */
                ></div>
                {/* Note: pkg.description from Quill is HTML. line-clamp might not work perfectly with HTML tags. 
                    Ideally strip tags for preview. For now, I'll just leave it or use a stripper if simple. 
                    Let's just use the View Details button for navigation primarily. 
                */}

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-bold text-primary-600">{formatPrice(pkg.price)}</p>
                  </div>

                  <div className="flex gap-2">
                    {onEdit ? (
                      // Admin View
                      <>
                        <button
                          onClick={() => onEdit(pkg)}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(pkg._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      // Public View
                      <a
                        href={`/package/${pkg._id}`}
                        className="w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PackageList;

