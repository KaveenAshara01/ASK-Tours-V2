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
            <div key={pkg._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200">
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
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pkg.description}</p>
                <p className="text-2xl font-bold text-primary-600 mb-4">{formatPrice(pkg.price)}</p>
                <div className="flex gap-2">
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

