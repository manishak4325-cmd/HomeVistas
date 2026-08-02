import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatchmakerStore } from '../store/useMatchmakerStore';
import { PropertyCard } from '../components/PropertyCard';
import api from '../services/api';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import type { Property } from '../types';

export const MatchResults = () => {
  const { preferences } = useMatchmakerStore();
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // Assuming api service has a post method
        const { data } = await api.post('/properties/match', preferences);
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch match results', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [preferences]);

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link to="/matchmaker" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quiz
            </Link>
            <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-primary" />
              Your Best Matches
            </h1>
            <p className="mt-2 text-muted-foreground">
              We found {results.length} properties based on your unique lifestyle preferences.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p className="text-lg">Analyzing properties with our AI...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((property) => (
              <div key={property._id} className="relative">
                {/* Match Score Badge passed into PropertyCard as prop, wait we need to update PropertyCard to accept it */}
                <PropertyCard property={property} showMatchScore={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No perfect matches found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your preferences to see more results.</p>
            <Link to="/matchmaker" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Retake Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
