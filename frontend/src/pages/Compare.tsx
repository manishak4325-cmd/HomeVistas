import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompareStore } from '../store/useCompareStore';
import api from '../services/api';
import { ArrowLeft, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Property } from '../types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export const Compare = () => {
  const { propertyIds, removeProperty } = useCompareStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (propertyIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedProps = await Promise.all(
          propertyIds.map((id) => api.get(`/properties/${id}`).then((res: any) => res.data))
        );
        setProperties(fetchedProps);
      } catch (error) {
        console.error('Error fetching properties for comparison:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyIds]);

  if (loading) {
    return <div className="min-h-screen pt-24 text-center">Loading comparison data...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">No properties selected</h2>
        <Link to="/properties" className="text-primary hover:underline">
          Go back to properties to add some
        </Link>
      </div>
    );
  }

  const allAmenities = Array.from(
    new Set(properties.flatMap((p) => p.amenities))
  ).sort();

  // Prepare data for radar chart
  const radarData = [
    { metric: 'Price (Inv)', ...properties.reduce((acc, p, i) => ({ ...acc, [`prop${i}`]: Math.max(10, 100 - (p.price / 5000000) * 100) }), {}) },
    { metric: 'Area', ...properties.reduce((acc, p, i) => ({ ...acc, [`prop${i}`]: Math.min(100, (p.area / 5000) * 100) }), {}) },
    { metric: 'Bedrooms', ...properties.reduce((acc, p, i) => ({ ...acc, [`prop${i}`]: Math.min(100, (p.bedrooms / 5) * 100) }), {}) },
    { metric: 'Bathrooms', ...properties.reduce((acc, p, i) => ({ ...acc, [`prop${i}`]: Math.min(100, (p.bathrooms / 5) * 100) }), {}) },
    { metric: 'Neighborhood', ...properties.reduce((acc, p, i) => ({ ...acc, [`prop${i}`]: p.neighborhood?.overallScore ? p.neighborhood.overallScore * 10 : 50 }), {}) },
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/properties" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Properties
        </Link>
        <h1 className="text-3xl font-extrabold mb-8">Compare Properties</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-border border-r w-1/4 bg-muted/50 font-semibold text-muted-foreground">Features</th>
                  {properties.map((p) => (
                    <th key={p._id} className="p-4 border-b border-border border-r relative w-[25%] align-top">
                      <button 
                        onClick={() => removeProperty(p._id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <img src={p.images[0] || 'https://via.placeholder.com/300x200'} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-1">{p.title}</h3>
                      <p className="text-xs text-muted-foreground">{p.location}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Price */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 border-r border-border font-medium">Price</td>
                  {properties.map((p) => {
                    const minPrice = Math.min(...properties.map(x => x.price));
                    return (
                      <td key={p._id} className={`p-4 border-r border-border font-bold text-lg ${p.price === minPrice ? 'text-green-600' : ''}`}>
                        ${p.price.toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
                
                {/* Price per sqft */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 border-r border-border font-medium">Price / sqft</td>
                  {properties.map((p) => {
                    const pricePerSqft = Math.round(p.price / p.area);
                    const minPps = Math.min(...properties.map(x => Math.round(x.price / x.area)));
                    return (
                      <td key={p._id} className={`p-4 border-r border-border ${pricePerSqft === minPps ? 'text-green-600 font-semibold' : 'text-muted-foreground'}`}>
                        ${pricePerSqft}
                      </td>
                    );
                  })}
                </tr>

                {/* Specs */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 border-r border-border font-medium">Bed / Bath</td>
                  {properties.map((p) => (
                    <td key={p._id} className="p-4 border-r border-border text-muted-foreground">
                      {p.bedrooms} Beds / {p.bathrooms} Baths
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="p-4 border-r border-border font-medium">Area</td>
                  {properties.map((p) => {
                    const maxArea = Math.max(...properties.map(x => x.area));
                    return (
                      <td key={p._id} className={`p-4 border-r border-border ${p.area === maxArea ? 'text-green-600 font-semibold' : 'text-muted-foreground'}`}>
                        {p.area} sqft
                      </td>
                    );
                  })}
                </tr>

                {/* Neighborhood Score */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 border-r border-border font-medium">Neighborhood Score</td>
                  {properties.map((p) => {
                    const score = p.neighborhood?.overallScore;
                    return (
                      <td key={p._id} className="p-4 border-r border-border">
                        {score ? (
                           <span className={`px-2 py-1 rounded text-xs font-bold text-white ${score >= 7.5 ? 'bg-green-500' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                             {score} / 10
                           </span>
                        ) : <span className="text-muted-foreground text-sm">N/A</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* Amenities */}
                {allAmenities.map((amenity) => (
                  <tr key={amenity} className="hover:bg-muted/20">
                    <td className="p-4 border-r border-border text-sm">{amenity}</td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 border-r border-border text-center">
                        {p.amenities.includes(amenity) ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Actions */}
                <tr>
                  <td className="p-4 border-r border-border"></td>
                  {properties.map((p) => (
                    <td key={p._id} className="p-4 border-r border-border text-center">
                      <Link to={`/properties/${p._id}`} className="inline-block w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-colors">
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-xl mb-6">Visual Comparison</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    {properties.map((p, i) => (
                      <Radar
                        key={p._id}
                        name={p.title.substring(0, 15) + '...'}
                        dataKey={`prop${i}`}
                        stroke={colors[i % colors.length]}
                        fill={colors[i % colors.length]}
                        fillOpacity={0.4}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                * Chart normalized for comparison. Price is inverted (higher is better value).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
