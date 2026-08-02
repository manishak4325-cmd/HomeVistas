import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import api from '../services/api';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Form states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/properties', {
        params: {
          keyword: searchParams.get('keyword'),
          minPrice: searchParams.get('minPrice'),
          maxPrice: searchParams.get('maxPrice'),
          type: searchParams.get('type'),
          bedrooms: searchParams.get('bedrooms'),
        }
      });
      setProperties(data.properties);
    } catch (error) {
      console.error('Error fetching properties', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (type) params.append('type', type);
    if (bedrooms) params.append('bedrooms', bedrooms);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Properties for Sale</h1>
          <p className="text-muted-foreground mt-2">Find your perfect match from our extensive collection.</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center bg-secondary text-secondary-foreground px-4 py-2 rounded-md"
        >
          <Filter className="w-4 h-4 mr-2" /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`w-full lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </h3>
            
            <form onSubmit={handleApplyFilters} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Search Keyword</label>
                <div className="relative">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Location, Title..."
                    className="w-full bg-background border border-input rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-background border border-input rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range ($)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 bg-background border border-input rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 bg-background border border-input rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <select 
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-background border border-input rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md font-medium transition-colors"
              >
                Apply Filters
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  setKeyword(''); setMinPrice(''); setMaxPrice(''); setType(''); setBedrooms('');
                  setSearchParams({});
                }}
                className="w-full mt-2 bg-transparent border border-input hover:bg-accent text-foreground py-2 rounded-md font-medium transition-colors"
              >
                Reset
              </button>
            </form>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-muted h-96 rounded-xl"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-xl">
              <h3 className="text-xl font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
