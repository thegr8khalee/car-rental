import sequelize from '../lib/db.js';
import Car from '../models/car.model.js';
// We don't need the full index.js which causes circular deps with User model sometimes
// import { syncDatabase } from '../models/index.js'; 

const migrateInventory = async () => {
  try {
    console.log('🚀 Starting inventory migration...');

    // 1. Sync Schema (Add columns)
    // We only care about Car model updates for now, or we can sync all if we imported them.
    // However, syncing the specific model might be safer if we want to avoid side effects.
    // But sequelize.sync() syncs the whole instance. 
    // Since we only imported Car, let's see if that's enough or if it wipes others (it shouldn't).
    // Better: use Car.sync({ alter: true }) to just sync the Car table.
    
    console.log('1. Syncing Car table schema...');
    await Car.sync({ alter: true });

    // 2. Backfill Data
    console.log('2. Backfilling existing inventory data...');
    
    const cars = await Car.findAll();
    let updatedCount = 0;

    for (const car of cars) {
      const updates = {};
      let needsUpdate = false;

      // Generate Stock Number: "{Year}-{Index}"
      // Using car.id.slice(0, 4) might be random UUID chars, maybe use a simpler counter if possible?
      // But we can't easily get a sequence here. Random chars are okay for unique stock # for now.
      if (!car.stockNumber) {
        // Use last 6 chars of UUID for uniqueness
        const uniqueSuffix = car.id.split('-').pop().slice(0, 6).toUpperCase();
        updates.stockNumber = `INV-${car.year}-${uniqueSuffix}`;
        needsUpdate = true;
      }

      // Map Sold -> Status
      if (car.sold && car.status !== 'sold') {
        updates.status = 'sold';
        needsUpdate = true;
      } else if (!car.sold && car.status === 'acquired') {
        // Default existing unsold cars to 'available'
        updates.status = 'available';
        needsUpdate = true;
      }

      // Default Location
      if (!car.location) {
        updates.location = 'Main Lot';
        needsUpdate = true;
      }

      // Default Config/Costs
      if (car.reconditioningCost === null) {
        updates.reconditioningCost = 0;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await car.update(updates);
        updatedCount++;
      }
    }

    console.log(`✅ Backfilled ${updatedCount} cars correctly.`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateInventory();
