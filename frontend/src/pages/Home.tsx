import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/properties?pageSize=3');
        setFeaturedProperties(data.properties);
      } catch (error) {
        console.error('Error fetching properties', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/properties?keyword=${keyword}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Discover the perfect property that fits your lifestyle. From cozy apartments to luxury villas, we have it all.
          </p>
          
          <form onSubmit={handleSearch} className="bg-background rounded-full p-2 flex shadow-xl max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by city, neighborhood or keyword..."
              className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-foreground"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">Explore our handpicked selection of premium real estate.</p>
          </div>
          <button 
            onClick={() => navigate('/properties')}
            className="hidden md:flex items-center text-primary font-medium hover:underline"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-muted h-96 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
