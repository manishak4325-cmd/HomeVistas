import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchmakerStore } from '../store/useMatchmakerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, Home, MapPin, Coffee, Briefcase, Dog } from 'lucide-react';

const steps = [
  { title: 'Budget & Type', subtitle: 'What are you looking for?' },
  { title: 'Location & Space', subtitle: 'Where and how big?' },
  { title: 'Lifestyle & Amenities', subtitle: 'What matters to you?' },
];

export const Matchmaker = () => {
  const navigate = useNavigate();
  const { preferences, setPreferences } = useMatchmakerStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/match-results');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const toggleCity = (city: string) => {
    const cities = preferences.cities.includes(city)
      ? preferences.cities.filter(c => c !== city)
      : [...preferences.cities, city];
    setPreferences({ cities });
  };

  const toggleAmenity = (amenity: string) => {
    const amenities = preferences.amenities.includes(amenity)
      ? preferences.amenities.filter(a => a !== amenity)
      : [...preferences.amenities, amenity];
    setPreferences({ amenities });
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-foreground flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Property Matchmaker
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Let our AI find the perfect home that fits your unique lifestyle.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 relative">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="text-center flex-1">
                <div className={`text-sm font-medium ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  Step {index + 1}
                </div>
                <div className={`text-xs ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-card shadow-xl rounded-2xl p-6 sm:p-10 border border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">{steps[currentStep].subtitle}</h2>

              {currentStep === 0 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium mb-3">Maximum Budget: ${preferences.budget.max.toLocaleString()}</label>
                    <input 
                      type="range" 
                      min="100000" 
                      max="5000000" 
                      step="50000"
                      value={preferences.budget.max}
                      onChange={(e) => setPreferences({ budget: { min: 0, max: Number(e.target.value) } })}
                      className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-4">Property Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Apartment', 'House', 'Villa', 'Penthouse'].map(type => (
                        <button
                          key={type}
                          onClick={() => setPreferences({ type })}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            preferences.type === type ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {type === 'Apartment' || type === 'Penthouse' ? <Building2 className="h-6 w-6" /> : <Home className="h-6 w-6" />}
                          <span className="font-medium">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium mb-3">Minimum Bedrooms</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          onClick={() => setPreferences({ bedrooms: num })}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                            preferences.bedrooms === num ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'
                          }`}
                        >
                          {num}{num === 5 ? '+' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Preferred Cities</label>
                    <div className="flex flex-wrap gap-3">
                      {['New York', 'Los Angeles', 'Chicago', 'Austin', 'San Francisco', 'Miami', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'].map(city => (
                        <button
                          key={city}
                          onClick={() => toggleCity(city)}
                          className={`px-4 py-2 rounded-full text-sm border flex items-center gap-2 transition-all ${
                            preferences.cities.includes(city) ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <MapPin className="h-3 w-3" />
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium mb-3">Your Lifestyle</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Family', 'Bachelor', 'Couple', 'Investor'].map(life => (
                        <button
                          key={life}
                          onClick={() => setPreferences({ lifestyle: life })}
                          className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${
                            preferences.lifestyle === life ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {life}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Must-have Amenities</label>
                    <div className="flex flex-wrap gap-3">
                      {['Pool', 'Gym', 'Balcony', 'Parking', 'Security', 'Garden'].map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-4 py-2 rounded-full text-sm border flex items-center gap-2 transition-all ${
                            preferences.amenities.includes(amenity) ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Coffee className="h-3 w-3" />
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6 pt-4">
                    <button
                      onClick={() => setPreferences({ wfh: !preferences.wfh })}
                      className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        preferences.wfh ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Briefcase className="h-6 w-6" />
                      <span className="font-medium text-sm">Work from Home</span>
                    </button>
                    <button
                      onClick={() => setPreferences({ pets: !preferences.pets })}
                      className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        preferences.pets ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Dog className="h-6 w-6" />
                      <span className="font-medium text-sm">Pet Friendly</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-between pt-6 border-t border-border">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-2 rounded-lg font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-2.5 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              {currentStep === steps.length - 1 ? (
                <>Find My Match <Sparkles className="h-4 w-4" /></>
              ) : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
