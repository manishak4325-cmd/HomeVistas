import { Bed, Bath, Square, MapPin, Scale, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompareStore } from '../store/useCompareStore';

interface Property {
  _id: string;
  title: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  city: string;
  images: string[];
  matchScore?: number;
  rating?: number;
  numReviews?: number;
  neighborhood?: {
    name: string;
    overallScore: number;
  };
}

export const PropertyCard = ({ property, showMatchScore = false }: { property: Property; showMatchScore?: boolean }) => {
  const { propertyIds, addProperty, removeProperty } = useCompareStore();
  const isCompared = propertyIds.includes(property._id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to details page
    if (isCompared) {
      removeProperty(property._id);
    } else {
      addProperty(property._id);
    }
  };

  return (
    <Link to={`/properties/${property._id}`} className="group cursor-pointer">
      <div className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={property.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {property.type}
          </div>
          
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            {showMatchScore && property.matchScore !== undefined && (
              <div className="bg-[#FF9F1C] text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="h-3.5 w-3.5" />
                {property.matchScore}% Match
              </div>
            )}
            
            {property.neighborhood && property.neighborhood.overallScore && (
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md text-white ${
                property.neighborhood.overallScore >= 7.5 ? 'bg-green-500' : property.neighborhood.overallScore >= 5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                Score: {property.neighborhood.overallScore}
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-lg shadow-md">
            ${property.price.toLocaleString()}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-sm mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{property.rating ? property.rating.toFixed(1) : 'New'}</span>
            <span className="text-muted-foreground ml-1">
              ({property.numReviews || 0} reviews)
            </span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="line-clamp-1">{property.location}, {property.city}</span>
          </div>
          
          <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Bed className="h-4 w-4 mr-1.5" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Bath className="h-4 w-4 mr-1.5" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Square className="h-4 w-4 mr-1.5" />
              <span>{property.area} sqft</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={toggleCompare}
              className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                isCompared 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Scale className="h-4 w-4" />
              {isCompared ? 'Remove from Compare' : 'Add to Compare'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
