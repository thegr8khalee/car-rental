import { jest } from '@jest/globals';

// --- Mocks Setup ---

// Mock DB and Models
const mockCar = {
  findByPk: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
  create: jest.fn()
};
const mockInventoryLog = {
  create: jest.fn(),
  findAll: jest.fn(),
  findAndCountAll: jest.fn()
};
const mockBlog = { findByPk: jest.fn() }; // Just in case
const mockCloudinary = {
  uploader: { upload: jest.fn() },
  api: { delete_resources: jest.fn() }
};
const mockAxios = { get: jest.fn() };

// unstable_mockModule calls must happen before imports
jest.unstable_mockModule('axios', () => ({ default: mockAxios }));
jest.unstable_mockModule('../src/lib/cloudinary.js', () => ({ default: mockCloudinary }));
jest.unstable_mockModule('../src/models/car.model.js', () => ({ default: mockCar }));
jest.unstable_mockModule('../src/models/inventoryLog.model.js', () => ({ default: mockInventoryLog }));
jest.unstable_mockModule('../src/models/blog.model.js', () => ({ default: mockBlog }));
jest.unstable_mockModule('../src/models/news.model.js', () => ({ default: {} }));
jest.unstable_mockModule('../src/models/broadcast.model.js', () => ({ default: {} }));
jest.unstable_mockModule('../src/services/gmail.service.js', () => ({ sendEmail: jest.fn() }));

// Import the modules to test
const { decodeVin } = await import('../src/services/vin.service.js');
const { updateCar } = await import('../src/controllers/admin.operations.controller.js');
const { getProfitabilityMetrics } = await import('../src/controllers/profitability.controller.js');

describe('Inventory System Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. VIN Decoding Service', () => {
    test('should correctly decode a valid VIN', async () => {
      const mockNhtsaResponse = {
        data: {
          Results: [
            { Variable: 'Make', Value: 'Toyota' },
            { Variable: 'Model', Value: 'Camry' },
            { Variable: 'Model Year', Value: '2024' },
            { Variable: 'Body Class', Value: 'Sedan' },
            { Variable: 'Fuel Type - Primary', Value: 'Gasoline' },
            { Variable: 'Displacement (L)', Value: '2.5' }
          ]
        }
      };

      mockAxios.get.mockResolvedValue(mockNhtsaResponse);

      const result = await decodeVin('12345678901234567');

      expect(mockAxios.get).toHaveBeenCalled();
      expect(result.data).toEqual(expect.objectContaining({
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        bodyType: 'sedan',
        fuelType: 'gasoline',
        engineSize: 2.5
      }));
    });

    test('should throw error for invalid VIN length', async () => {
      await expect(decodeVin('SHORT')).rejects.toThrow('Invalid VIN');
    });
  });

  describe('2. Audit Logging (Update Car)', () => {
    test('should create an InventoryLog when critical fields disappear', async () => {
      // Setup: Existing car in DB
      const existingCar = {
        id: 1,
        price: 20000,
        status: 'available',
        costPrice: 15000,
        imageUrls: [],
        update: jest.fn().mockResolvedValue(true)
      };
      mockCar.findByPk.mockResolvedValue(existingCar);

      // Setup: Request with new price and status
      const req = {
        params: { id: 1 },
        body: {
          price: 22000, // Changed (+2000)
          status: 'reserved' // Changed
        },
        admin: { id: 99 } // Admin user performing action
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateCar(req, res);

      // Vertify Car Update
      expect(existingCar.update).toHaveBeenCalled();
      
      // Verify Audit Log Creation
      // It should detect PRICE_CHANGE or STATUS_CHANGE
      expect(mockInventoryLog.create).toHaveBeenCalledWith(expect.objectContaining({
        carId: 1,
        adminId: 99,
        // We expect detailed diff
        details: expect.objectContaining({
          price: { old: 20000, new: 22000 },
          status: { old: 'available', new: 'reserved' }
        })
      }));
    });
  });

  describe('3. Profitability Calculations', () => {
    test('should calculate gross value, revenue, and profit correctly', async () => {
      // Setup: Mock Cars
      const mockCars = [
        // Active Car
        { id: 1, status: 'available', sold: false, price: 30000, costPrice: 20000, reconditioningCost: 1000, make: 'Toyota' },
        // Sold Car 1 (Profit: 25k - 15k - 0 = 10k)
        { id: 2, status: 'sold', sold: true, price: 25000, costPrice: 15000, reconditioningCost: 0, make: 'Honda' },
        // Sold Car 2 (Profit: 40k - 35k - 2k = 3k)
        { id: 3, status: 'sold', sold: true, price: 40000, costPrice: 35000, reconditioningCost: 2000, make: 'Toyota' },
      ];
      mockCar.findAll.mockResolvedValue(mockCars);
      mockInventoryLog.findAll.mockResolvedValue([]); // No logs for this test
      
      const req = { user: { role: 'admin' } }; // Auth check mock if needed
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getProfitabilityMetrics(req, res);

      const jsonResponse = res.json.mock.calls[0][0];
      const metrics = jsonResponse.metrics;
      const profitByMake = jsonResponse.profitByMake;

      // 1. Gross Inventory Value (Only Active)
      // Car 1: 20,000
      expect(metrics.grossInventoryValue).toBe(20000);

      // 2. Projected Revenue (Only Active)
      // Car 1: 30,000
      expect(metrics.projectedRevenue).toBe(30000);

      // 3. Realized Profit (Only Sold)
      // Car 2 (10k) + Car 3 (3k) = 13k
      expect(metrics.realizedProfit).toBe(13000);

      // 4. Profit By Make (Toyota)
      // Toyota has 1 active (ignored for realized logic usually, or included in table?) 
      // The controller calculates profit by make for SOLD cars.
      // Toyota Sold: Car 3 (Profit 3k)
      const toyotaStats = profitByMake.find(m => m.make === 'Toyota');
      expect(toyotaStats.totalProfit).toBe(3000);
      expect(toyotaStats.count).toBe(1);

      // Honda Sold: Car 2 (Profit 10k)
      const hondaStats = profitByMake.find(m => m.make === 'Honda');
      expect(hondaStats.totalProfit).toBe(10000);
    });
  });
});
