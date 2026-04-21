import Car from '../models/car.model.js';
import InventoryLog from '../models/inventoryLog.model.js';
import { Op, Sequelize } from 'sequelize';

export const getProfitabilityMetrics = async (req, res) => {
  try {
    // Get all cars for comprehensive metrics
    const allCars = await Car.findAll({
      attributes: [
        'id',
        'make',
        'model',
        'year',
        'price',
        'costPrice',
        'reconditioningCost',
        'status',
        'sold',
        'createdAt',
      ],
    });

    // Filter active vs sold inventory
    const activeInventory = allCars.filter(
      (car) => !car.sold && car.status !== 'sold'
    );
    const soldCars = allCars.filter(
      (car) => car.sold || car.status === 'sold'
    );

    // 1. Gross Inventory Value
    const grossInventoryValue = activeInventory.reduce(
      (sum, car) => sum + (car.costPrice || 0),
      0
    );

    // 2. Projected Revenue
    const projectedRevenue = activeInventory.reduce(
      (sum, car) => sum + (car.price || 0),
      0
    );

    // 3. Realized Profit
    const realizedProfit = soldCars.reduce((sum, car) => {
      const cost = car.costPrice || 0;
      const reconditioning = car.reconditioningCost || 0;
      const revenue = car.price || 0;
      return sum + (revenue - cost - reconditioning);
    }, 0);

    // 4. Average Markup %
    const avgMarkup = activeInventory.length > 0
      ? activeInventory.reduce((sum, car) => {
          const cost = car.costPrice || car.price;
          const markup = ((car.price - cost) / (cost || car.price)) * 100;
          return sum + (markup || 0);
        }, 0) / activeInventory.length
      : 0;

    // 5. Profit by Make
    const profitByMake = {};
    soldCars.forEach((car) => {
      const make = car.make || 'Unknown';
      const profit = (car.price || 0) - (car.costPrice || 0) - (car.reconditioningCost || 0);
      
      if (!profitByMake[make]) {
        profitByMake[make] = {
          totalProfit: 0,
          totalRevenue: 0,
          totalCost: 0,
          count: 0,
          avgProfit: 0,
          avgMarkup: 0,
        };
      }
      
      profitByMake[make].totalProfit += profit;
      profitByMake[make].totalRevenue += car.price || 0;
      profitByMake[make].totalCost += car.costPrice || 0;
      profitByMake[make].count += 1;
    });

    // Calculate averages for each make
    Object.keys(profitByMake).forEach((make) => {
      const data = profitByMake[make];
      data.avgProfit = data.totalProfit / data.count;
      data.avgMarkup = ((data.totalRevenue - data.totalCost) / (data.totalCost || data.totalRevenue)) * 100;
    });

    // 6. Inventory Turnover & Days to Sell
    const turnoverRate = allCars.length > 0
      ? (soldCars.length / allCars.length) * 100
      : 0;

    // Estimate days to sell (if we have history, this would be more accurate)
    const avgDaysToSell = turnoverRate > 0
      ? Math.round(30 / (turnoverRate / 100))
      : 0;

    // 7. Recent Activity from Logs
    const recentLogs = await InventoryLog.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'carId', 'action', 'details', 'createdAt'],
    });

    res.status(200).json({
      success: true,
      metrics: {
        grossInventoryValue,
        projectedRevenue,
        potentialProfit: projectedRevenue - grossInventoryValue,
        realizedProfit,
        avgMarkup,
        activeInventoryCount: activeInventory.length,
        soldCount: soldCars.length,
        totalInventory: allCars.length,
        turnoverRate: parseFloat(turnoverRate.toFixed(2)),
        avgDaysToSell,
      },
      profitByMake: Object.entries(profitByMake)
        .map(([make, data]) => ({
          make,
          ...data,
        }))
        .sort((a, b) => b.totalProfit - a.totalProfit),
      recentActivity: recentLogs,
    });
  } catch (error) {
    console.error('Error getting profitability metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profitability metrics',
      error: error.message,
    });
  }
};

export const getProfitabilityByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const cars = await Car.findAll({
      where,
      attributes: [
        'id',
        'make',
        'price',
        'costPrice',
        'reconditioningCost',
        'status',
        'sold',
        'createdAt',
      ],
    });

    const soldCars = cars.filter((car) => car.sold || car.status === 'sold');

    const profit = soldCars.reduce((sum, car) => {
      const cost = car.costPrice || 0;
      const reconditioning = car.reconditioningCost || 0;
      const revenue = car.price || 0;
      return sum + (revenue - cost - reconditioning);
    }, 0);

    const metrics = {
      period: { startDate, endDate },
      carsProcessed: cars.length,
      carsSold: soldCars.length,
      totalRevenue: soldCars.reduce((sum, car) => sum + (car.price || 0), 0),
      totalCost: soldCars.reduce((sum, car) => sum + (car.costPrice || 0), 0),
      totalReconditioning: soldCars.reduce(
        (sum, car) => sum + (car.reconditioningCost || 0),
        0
      ),
      totalProfit: profit,
      avgProfitPerCar: soldCars.length > 0 ? profit / soldCars.length : 0,
    };

    res.status(200).json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Error getting date range profitability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve date range profitability',
      error: error.message,
    });
  }
};

export const getInventoryAuditTrail = async (req, res) => {
  try {
    const { carId, action, adminId } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const where = {};
    if (carId) where.carId = carId;
    if (action) where.action = action;
    if (adminId) where.adminId = adminId;

    const { count, rows: logs } = await InventoryLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      logs,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error getting audit trail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit trail',
      error: error.message,
    });
  }
};
