import mongoose from 'mongoose';

const neighborhoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    scores: {
      safety: { type: Number, required: true, min: 1, max: 10 },
      schools: { type: Number, required: true, min: 1, max: 10 },
      transport: { type: Number, required: true, min: 1, max: 10 },
      healthcare: { type: Number, required: true, min: 1, max: 10 },
      parks: { type: Number, required: true, min: 1, max: 10 },
      pollution: { type: Number, required: true, min: 1, max: 10 },
      futureDevelopment: { type: Number, required: true, min: 1, max: 10 },
      lifestyle: { type: Number, required: true, min: 1, max: 10 },
    },
    overallScore: { type: Number, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

neighborhoodSchema.pre('save', function (next) {
  if (this.isModified('scores') || !this.overallScore) {
    const s = this.scores;
    const total =
      s.safety +
      s.schools +
      s.transport +
      s.healthcare +
      s.parks +
      s.pollution +
      s.futureDevelopment +
      s.lifestyle;
    this.overallScore = parseFloat((total / 8).toFixed(1));
  }
  next();
});

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);
export default Neighborhood;
