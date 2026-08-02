import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart, Mail, CheckCircle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Optional: integrate later
import 'leaflet/dist/leaflet.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNeighborhoodDetails, setShowNeighborhoodDetails] = useState(false);

  // Inquiry form
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: 'I am interested in this property. Please send me more details.',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
        
        if (user) {
          const favRes = await api.get('/favorites');
          const isFav = favRes.data.some((fav: any) => fav.property._id === data._id);
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error('Error fetching property', error);
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add to favorites');
      return navigate('/login');
    }
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${property._id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.post('/favorites', { property: property._id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inquiries', {
        ...formData,
        property: property._id,
      });
      toast.success('Inquiry sent successfully!');
      setFormData({ ...formData, message: '', phone: '' });
    } catch (error) {
      toast.error('Failed to send inquiry');
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-96 bg-muted rounded-xl mb-8"></div>
      <div className="h-10 bg-muted w-1/3 mb-4 rounded"></div>
      <div className="h-4 bg-muted w-1/4 mb-8 rounded"></div>
    </div>
  );

  if (!property) return <div className="text-center py-20 text-xl">Property not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {property.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${property.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
              {property.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-5 w-5 mr-1" />
            <span className="text-lg">{property.location}, {property.city}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-3xl font-bold text-primary mb-3">
            ${property.price.toLocaleString()}
          </div>
          <button 
            onClick={toggleFavorite}
            className={`flex items-center px-4 py-2 rounded-md border ${isFavorite ? 'bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-background hover:bg-accent border-input'}`}
          >
            <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Saved to Favorites' : 'Save Property'}
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 h-[500px]">
        <div className="md:col-span-2 h-full rounded-xl overflow-hidden">
          <img 
            src={property.images[0] || 'https://via.placeholder.com/800x600'} 
            alt="Main" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="h-1/2 rounded-xl overflow-hidden">
             <img 
              src={property.images[1] || property.images[0]} 
              alt="Secondary" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="h-1/2 rounded-xl overflow-hidden">
             <img 
              src={property.images[2] || property.images[0]} 
              alt="Third" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          {/* Key Features */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 flex justify-around">
            <div className="flex flex-col items-center">
              <Bed className="h-8 w-8 text-primary mb-2" />
              <span className="font-semibold text-lg">{property.bedrooms}</span>
              <span className="text-muted-foreground text-sm">Bedrooms</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="h-8 w-8 text-primary mb-2" />
              <span className="font-semibold text-lg">{property.bathrooms}</span>
              <span className="text-muted-foreground text-sm">Bathrooms</span>
            </div>
            <div className="flex flex-col items-center">
              <Square className="h-8 w-8 text-primary mb-2" />
              <span className="font-semibold text-lg">{property.area}</span>
              <span className="text-muted-foreground text-sm">Square Feet</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About this property</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

        {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhood Intelligence Score */}
          {property.neighborhood && property.neighborhood.scores && (
            <div className="mb-8 bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowNeighborhoodDetails(!showNeighborhoodDetails)}>
                <div>
                  <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    Neighborhood Score
                  </h2>
                  <p className="text-muted-foreground">{property.neighborhood.name}, {property.neighborhood.city}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold px-4 py-2 rounded-lg text-white ${
                    property.neighborhood.overallScore >= 7.5 ? 'bg-green-500' : property.neighborhood.overallScore >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {property.neighborhood.overallScore} / 10
                  </div>
                  {showNeighborhoodDetails ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                </div>
              </div>

              {showNeighborhoodDetails && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="mb-6 text-muted-foreground">{property.neighborhood.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {Object.entries(property.neighborhood.scores).map(([key, value]) => {
                      if (key === '_id' || key === 'id') return null;
                      const scoreValue = value as number;
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-sm">{label}</span>
                            <span className="text-sm font-bold">{scoreValue}/10</span>
                          </div>
                          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${scoreValue >= 7.5 ? 'bg-green-500' : scoreValue >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${(scoreValue / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {property.neighborhood.highlights && property.neighborhood.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Key Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.neighborhood.highlights.map((highlight: string, idx: number) => (
                          <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Contact Owner / Agent</h3>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                {property.owner.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{property.owner.name}</p>
                <p className="text-sm text-muted-foreground">{property.owner.email}</p>
              </div>
            </div>

            <form onSubmit={submitInquiry} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full bg-background border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  className="w-full bg-background border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  placeholder="Your Phone"
                  className="w-full bg-background border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <textarea
                  required
                  rows={4}
                  placeholder="I'm interested in this property..."
                  className="w-full bg-background border border-input rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-md font-medium flex justify-center items-center gap-2 transition-colors"
              >
                <Mail className="h-5 w-5" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
