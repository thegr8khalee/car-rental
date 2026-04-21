import { Location, Booking, sequelize, closeDatabase } from '../src/models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    await Location.sync({ alter: true });
    console.log('✅ Location table ready');
    await Booking.sync({ alter: true });
    console.log('✅ Booking table ready');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
})();
