import { Link, useNavigate } from 'react-router-dom';
import MediaCarousel from './MediaCarousel';
import { optimizeImage } from '../utils/imageOptimizer';

function PackageCard({ package: pkg }) {
  const navigate = useNavigate();



  // Backward compatibility: if old image field exists, convert it to images array
  const rawImages = pkg.images && pkg.images.length > 0
    ? pkg.images
    : pkg.image
      ? [pkg.image]
      : [];

  const images = rawImages.map(img => optimizeImage(img, 600));
  const videos = pkg.videos || [];

  return (
    <div className="card group flex flex-col h-full">
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <MediaCarousel
          images={images}
          videos={videos}
          onImageClick={() => navigate(`/package/${pkg._id}`)}
          autoplay={true}
          interval={4000}
        />
        {pkg.featured && (
          <div className="absolute top-4 right-4 bg-secondary-500 text-primary-950 px-3 py-1 rounded-full text-sm font-bold z-20">
            Featured
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/package/${pkg._id}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-700 transition-colors">{pkg.title}</h3>
        </Link>
        <div
          className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none flex-grow"
          dangerouslySetInnerHTML={{ __html: pkg.description }}
        />
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 gap-4">
          <span className="text-xl font-bold text-primary-600 whitespace-nowrap">
            {pkg.duration}
          </span>
          <Link
            to={`/package/${pkg._id}`}
            className="bg-primary-600 hover:bg-secondary-500 hover:text-primary-950 text-white px-5 py-3 rounded-lg transition-colors font-semibold whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;

