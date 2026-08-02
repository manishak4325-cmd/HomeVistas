import { useNavigate } from 'react-router-dom';
import { useCompareStore } from '../store/useCompareStore';
import { Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CompareBottomBar = () => {
  const { propertyIds, clearProperties } = useCompareStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {propertyIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
        >
          <div className="max-w-3xl mx-auto bg-card border-t border-l border-r border-border shadow-2xl rounded-t-2xl p-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 text-primary p-2 rounded-full">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">{propertyIds.length} properties selected</p>
                <p className="text-xs text-muted-foreground">Select up to 4 to compare</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={clearProperties}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => navigate('/compare')}
                disabled={propertyIds.length < 2}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Compare Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
