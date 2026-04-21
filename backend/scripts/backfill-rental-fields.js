import { Car, sequelize, closeDatabase } from '../src/models/index.js';

const updates = [
  { where: { make: 'Toyota', model: 'Camry' },    values: { dailyRate: 85,  weeklyRate: 540, depositAmount: 300, minRentalDays: 1, maxRentalDays: 30, rentalStatus: 'available', seats: 5, mileagePolicy: '200 miles/day' } },
  { where: { make: 'Honda',  model: 'Civic' },    values: { dailyRate: 62,  weeklyRate: 390, depositAmount: 250, minRentalDays: 1, maxRentalDays: 30, rentalStatus: 'available', seats: 5, mileagePolicy: 'Unlimited' } },
  { where: { make: 'Ford',   model: 'F-150' },    values: { dailyRate: 120, weeklyRate: 780, depositAmount: 500, minRentalDays: 1, maxRentalDays: 21, rentalStatus: 'available', seats: 5, mileagePolicy: '250 miles/day' } },
  { where: { make: 'Tesla',  model: 'Model 3' },  values: { dailyRate: 145, weeklyRate: 940, depositAmount: 600, minRentalDays: 1, maxRentalDays: 30, rentalStatus: 'available', seats: 5, mileagePolicy: 'Unlimited' } },
  { where: { make: 'Jeep',   model: 'Wrangler' }, values: { dailyRate: 135, weeklyRate: 870, depositAmount: 500, minRentalDays: 1, maxRentalDays: 21, rentalStatus: 'available', seats: 5, mileagePolicy: '200 miles/day' } },
];

(async () => {
  try {
    await sequelize.authenticate();
    for (const u of updates) {
      const [count] = await Car.update(u.values, { where: u.where });
      console.log(`${u.where.make} ${u.where.model}: ${count} row(s) updated`);
    }
    console.log('✅ Backfill complete');
  } catch (err) {
    console.error('❌ Backfill failed:', err.message);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
})();
