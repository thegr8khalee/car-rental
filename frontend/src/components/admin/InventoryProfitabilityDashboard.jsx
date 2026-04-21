import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '../../store/useDasboardStore';
import { TrendingUp, TrendingDown, DollarSign, Package, Clock, AlertCircle, RefreshCw, Loader2, BarChart3 } from 'lucide-react';

const InventoryProfitabilityDashboard = () => {
  const { getListings, listings, isFetchingListings } = useDashboardStore();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profitByMake, setProfitByMake] = useState({});
  const [daysToSellStats, setDaysToSellStats] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all listings (no pagination for now, assume reasonable inventory size)
      await getListings({ page: 1, limit: 1000 });
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics whenever listings change
  useEffect(() => {
    if (listings && listings.length > 0) {
      calculateMetrics();
    }
  }, [listings]);

  const calculateMetrics = () => {
    // Filter active (non-sold) inventory
    const activeInventory = listings.filter(
      (car) => !car.sold && car.status !== 'sold'
    );
    const soldCars = listings.filter(
      (car) => car.sold || car.status === 'sold'
    );

    // 1. Gross Inventory Value (Sum of Cost)
    const grossInventoryValue = activeInventory.reduce(
      (sum, car) => sum + (car.costPrice || 0),
      0
    );

    // 2. Projected Revenue (Sum of Listing Prices - active inventory)
    const projectedRevenue = activeInventory.reduce(
      (sum, car) => sum + (car.price || 0),
      0
    );

    // 3. Realized Profit (from sold cars - last 30 days or all if not tracked)
    // Assuming we don't have createdAt tracking yet, use all sold cars
    const realizedProfit = soldCars.reduce((sum, car) => {
      const cost = car.costPrice || 0;
      const reconditioning = car.reconditioningCost || 0;
      const revenue = car.price || 0;
      return sum + (revenue - cost - reconditioning);
    }, 0);

    // 4. Average Markup %
    const avgMarkup = activeInventory.length > 0
      ? activeInventory.reduce((sum, car) => {
          const cost = car.costPrice || car.price; // Fallback to price if no cost
          const markup = ((car.price - cost) / cost) * 100;
          return sum + (markup || 0);
        }, 0) / activeInventory.length
      : 0;

    // 5. Profit by Make
    const profitByMakeMap = {};
    soldCars.forEach((car) => {
      const make = car.make || 'Unknown';
      const profit = (car.price || 0) - (car.costPrice || 0) - (car.reconditioningCost || 0);
      if (!profitByMakeMap[make]) {
        profitByMakeMap[make] = { total: 0, count: 0 };
      }
      profitByMakeMap[make].total += profit;
      profitByMakeMap[make].count += 1;
    });

    // Convert to sortable array
    const profitByMakeSorted = Object.entries(profitByMakeMap)
      .map(([make, data]) => ({
        make,
        totalProfit: data.total,
        avgProfit: data.total / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit);

    setProfitByMake(profitByMakeSorted);

    // 6. Days to Sell (mock - would need createdAt and soldAt dates)
    // For now, calculate based on inventory turnover
    const turnoverRate = soldCars.length > 0
      ? (soldCars.length / (activeInventory.length + soldCars.length)) * 100
      : 0;
    const estimatedDaysToSell = turnoverRate > 0
      ? Math.round(30 / (turnoverRate / 100))
      : 0;

    setDaysToSellStats({
      avgDaysToSell: estimatedDaysToSell,
      turnoverRate: turnoverRate.toFixed(1),
      totalSold: soldCars.length,
      activeInventory: activeInventory.length,
    });

    setMetrics({
      grossInventoryValue,
      projectedRevenue,
      realizedProfit,
      avgMarkup,
      activeInventoryCount: activeInventory.length,
      soldCount: soldCars.length,
      totalInventory: listings.length,
      potentialProfit: projectedRevenue - grossInventoryValue,
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading || isFetchingListings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated)] animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-[var(--color-elevated)] rounded animate-pulse" />
            <div className="h-4 w-32 bg-[var(--color-elevated)] rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 bg-[var(--color-elevated)] rounded animate-pulse" />
                <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated)] animate-pulse" />
              </div>
              <div className="h-8 w-32 bg-[var(--color-elevated)] rounded animate-pulse" />
              <div className="h-4 w-20 bg-[var(--color-elevated)] rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <div className="h-64 bg-[var(--color-elevated)] rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <p className="text-[var(--color-muted)] font-medium">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Profitability Dashboard</h1>
            <p className="text-sm text-[var(--color-muted)]">Track inventory value and profits</p>
          </div>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl hover:bg-[var(--color-elevated)] transition-colors font-medium text-[var(--color-text)] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Inventory Value */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-[var(--color-muted)]">Gross Inventory Value</h2>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {formatCurrency(metrics.grossInventoryValue)}
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            {metrics.activeInventoryCount} cars in stock
          </p>
        </div>

        {/* Projected Revenue */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-[var(--color-muted)]">Projected Revenue</h2>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {formatCurrency(metrics.projectedRevenue)}
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            List price of active inventory
          </p>
        </div>

        {/* Realized Profit */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-[var(--color-muted)]">Realized Profit</h2>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(metrics.realizedProfit)}
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            {metrics.soldCount} cars sold
          </p>
        </div>

        {/* Potential Profit */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-[var(--color-muted)]">Potential Profit</h2>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {formatCurrency(metrics.potentialProfit)}
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            If all active inventory sells
          </p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Markup */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <h2 className="text-sm text-[var(--color-muted)] mb-3">Average Markup</h2>
          <p className="text-3xl font-bold text-primary">
            {metrics.avgMarkup.toFixed(1)}%
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-2">
            Markup across active inventory
          </p>
        </div>

        {/* Inventory Turnover */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <h2 className="text-sm text-[var(--color-muted)] mb-3">Turnover Rate</h2>
          <p className="text-3xl font-bold text-emerald-600">
            {daysToSellStats.turnoverRate}%
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-2">
            {daysToSellStats.totalSold} of {daysToSellStats.totalSold + daysToSellStats.activeInventory} sold
          </p>
        </div>

        {/* Average Days to Sell */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-[var(--color-muted)]">Est. Days to Sell</h2>
            <Clock className="w-4 h-4 text-[var(--color-muted)]" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {daysToSellStats.avgDaysToSell}
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-2">
            Based on turnover rate
          </p>
        </div>
      </div>

      {/* Profit by Make */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Profit by Make</h2>
        {profitByMake.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-sm font-medium text-[var(--color-muted)] py-3 px-4">Make</th>
                  <th className="text-right text-sm font-medium text-[var(--color-muted)] py-3 px-4">Total Profit</th>
                  <th className="text-right text-sm font-medium text-[var(--color-muted)] py-3 px-4">Avg Profit</th>
                  <th className="text-right text-sm font-medium text-[var(--color-muted)] py-3 px-4">Sold</th>
                </tr>
              </thead>
              <tbody>
                {profitByMake.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-[var(--color-elevated)] transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--color-text)]">{item.make}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">
                      {formatCurrency(item.totalProfit)}
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--color-text)]">
                      {formatCurrency(item.avgProfit)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {item.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
              <Package className="w-8 h-8 text-[var(--color-muted)]" />
            </div>
            <p className="text-[var(--color-muted)]">No sold cars yet</p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Inventory Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-[var(--color-elevated)] rounded-xl">
            <p className="text-xs text-[var(--color-muted)] mb-1">Total Inventory</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">{metrics.totalInventory}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl">
            <p className="text-xs text-[var(--color-muted)] mb-1">Active (For Sale)</p>
            <p className="text-2xl font-bold text-amber-600">
              {metrics.activeInventoryCount}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl">
            <p className="text-xs text-[var(--color-muted)] mb-1">Sold</p>
            <p className="text-2xl font-bold text-emerald-600">
              {metrics.soldCount}
            </p>
          </div>
          <div className="p-4 bg-primary/10 rounded-xl">
            <p className="text-xs text-[var(--color-muted)] mb-1">Avg Cost per Vehicle</p>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {formatCurrency(
                metrics.grossInventoryValue / (metrics.activeInventoryCount || 1)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryProfitabilityDashboard;
