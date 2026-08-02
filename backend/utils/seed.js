import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Favorite from '../models/Favorite.js';
import Inquiry from '../models/Inquiry.js';
import Neighborhood from '../models/Neighborhood.js';
import { users } from '../data/users.js';
import { properties } from '../data/properties.js';
import { neighborhoods } from '../data/neighborhoods.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Favorite.deleteMany();
    await Inquiry.deleteMany();
    await Property.deleteMany();
    await Neighborhood.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    
    const neighborhoodsWithScores = neighborhoods.map(n => {
      const s = n.scores;
      const total = s.safety + s.schools + s.transport + s.healthcare + s.parks + s.pollution + s.futureDevelopment + s.lifestyle;
      return { ...n, overallScore: parseFloat((total / 8).toFixed(1)) };
    });
    const createdNeighborhoods = await Neighborhood.insertMany(neighborhoodsWithScores);
    
    // Assign properties to the Admin user for now
    const adminUser = createdUsers[0]._id;
    const agentUser = createdUsers[1]._id;

    const sampleProperties = properties.map((property, index) => {
      // Find matching neighborhood by city (or use a default one)
      let matchedNeighborhood = createdNeighborhoods.find(n => n.city === property.city);
      // Fallback if no exact city match
      if (!matchedNeighborhood && createdNeighborhoods.length > 0) {
        matchedNeighborhood = createdNeighborhoods[0];
      }

      return { 
        ...property, 
        owner: index % 2 === 0 ? adminUser : agentUser,
        neighborhood: matchedNeighborhood ? matchedNeighborhood._id : undefined,
      };
    });

    await Property.insertMany(sampleProperties);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Favorite.deleteMany();
    await Inquiry.deleteMany();
    await Property.deleteMany();
    await Neighborhood.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destroy: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
