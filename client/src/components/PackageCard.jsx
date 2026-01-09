import { Link, useNavigate } from 'react-router-dom';
import MediaCarousel from './MediaCarousel';

function PackageCard({ package: pkg }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Backward compatibility: if old image field exists, convert it to images array
  const images = pkg.images && pkg.images.length > 0
    ? pkg.images
    : pkg.image
      ? [pkg.image]
      : [];
  const videos = pkg.videos || [];

  return (
    <div className="card group flex flex-col h-full">
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <MediaCarousel
          images={images}
          videos={videos}
          baseUrl="http://localhost:5000"
          onImageClick={() => navigate(`/package/${pkg._id}`)}
        />
        {pkg.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold z-20">
            Featured
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/package/${pkg._id}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">{pkg.title}</h3>
        </Link>
        <div
          className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none flex-grow"
          dangerouslySetInnerHTML={{ __html: pkg.description }}
        />
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-3xl font-bold text-primary-600">{formatPrice(pkg.price)}</span>
          <Link
            to={`/package/${pkg._id}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;

