// src/components/Admin/AdminAnalytics.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Car,
  Users,
  FileText,
  MessageSquare,
  Star,
  DollarSign,
  Calendar,
  Eye,
  ShoppingCart,
  PieChart,
  Activity,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Mail,
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDasboardStore';
import { useUserAuthStore } from '../../store/useUserAuthStore';

const AdminAnalytics = () => {
  const { authUser } = useUserAuthStore();
  const {
    dashboardStats,
    carStats,
    blogStats,
    isLoading,
    getDashboardStats,
    getCarStats,
    getBlogStats,
    getUserStats,
  } = useDashboardStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAnalytics = async () => {
    await Promise.all([
      getDashboardStats(),
      getCarStats(),
      getBlogStats(),
      getUserStats(),
    ]);
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalytics();
    setIsRefreshing(false);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getChangeIndicator = (change) => {
    if (!change && change !== 0) return null;
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  if (isLoading && !dashboardStats) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated)] animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-[var(--color-elevated)] rounded animate-pulse" />
              <div className="h-4 w-48 bg-[var(--color-elevated)] rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5">
              <div className="h-4 w-24 bg-[var(--color-elevated)] rounded animate-pulse mb-3" />
              <div className="h-8 w-20 bg-[var(--color-elevated)] rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
              <div className="h-5 w-40 bg-[var(--color-elevated)] rounded animate-pulse mb-6" />
              <div className="h-64 bg-[var(--color-elevated)] rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Analytics</h1>
            <p className="text-sm text-[var(--color-muted)]">Business performance insights</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl hover:bg-[var(--color-elevated)] transition-colors disabled:opacity-50"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inventory"
          value={formatNumber(dashboardStats?.cars?.total || 0)}
          subValue={`${dashboardStats?.cars?.available || 0} available`}
          icon={<Car className="w-5 h-5" />}
          color="bg-blue-500"
          change={dashboardStats?.cars?.salesChange}
        />
        <StatCard
          title="Total Users"
          value={formatNumber(dashboardStats?.users?.total || 0)}
          subValue={`+${dashboardStats?.users?.newThisMonth || 0} this month`}
          icon={<Users className="w-5 h-5" />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Blog Views"
          value={formatNumber(dashboardStats?.blogs?.totalViews || 0)}
          subValue={`${dashboardStats?.blogs?.published || 0} published`}
          icon={<Eye className="w-5 h-5" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Engagement"
          value={formatNumber((dashboardStats?.engagement?.totalComments || 0) + (dashboardStats?.engagement?.totalReviews || 0))}
          subValue={`${dashboardStats?.engagement?.pendingComments || 0} pending`}
          icon={<MessageSquare className="w-5 h-5" />}
          color="bg-amber-500"
        />
      </div>

      {/* Revenue Stats (Admin Only) */}
      {authUser?.role === 'admin' && dashboardStats?.revenue && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-emerald-100 text-sm font-medium">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-200" />
            </div>
            <p className="text-2xl font-bold">{dashboardStats.revenue.totalRevenue}</p>
            <p className="text-emerald-100 text-sm mt-1">Lifetime sales</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-100 text-sm font-medium">Monthly Revenue</span>
              <Calendar className="w-5 h-5 text-blue-200" />
            </div>
            <p className="text-2xl font-bold">{dashboardStats.revenue.monthlyRevenue}</p>
            <p className="text-blue-100 text-sm mt-1">This month</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-100 text-sm font-medium">Avg. Car Price</span>
              <TrendingUp className="w-5 h-5 text-purple-200" />
            </div>
            <p className="text-2xl font-bold">{dashboardStats.revenue.averageCarPrice}</p>
            <p className="text-purple-100 text-sm mt-1">Per vehicle</p>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory by Body Type */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Inventory by Body Type
          </h3>
          {carStats?.byBodyType?.length > 0 ? (
            <div className="space-y-3">
              {carStats.byBodyType.slice(0, 6).map((item, index) => {
                const total = carStats.byBodyType.reduce((acc, curr) => acc + parseInt(curr.count), 0);
                const percentage = ((parseInt(item.count) / total) * 100).toFixed(1);
                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500', 'bg-cyan-500'];
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[var(--color-text)]">{item.bodyType || 'Unknown'}</span>
                      <span className="text-sm text-[var(--color-muted)]">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-[var(--color-elevated)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Car} message="No inventory data available" />
          )}
        </div>

        {/* Top Makes */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Top Makes
          </h3>
          {carStats?.byMake?.length > 0 ? (
            <div className="space-y-3">
              {carStats.byMake.slice(0, 6).map((item, index) => {
                const maxCount = Math.max(...carStats.byMake.map(m => parseInt(m.count)));
                const percentage = (parseInt(item.count) / maxCount) * 100;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[var(--color-text)] w-24 truncate">{item.make}</span>
                    <div className="flex-1 h-8 bg-[var(--color-elevated)] rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-primary/80 rounded-lg transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-end pr-3 text-xs font-medium text-[var(--color-text)]">
                        {item.count} cars ({item.soldCount || 0} sold)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Car} message="No make data available" />
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Distribution */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Price Distribution
          </h3>
          {carStats?.priceDistribution?.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {carStats.priceDistribution.map((item, index) => {
                const colors = ['bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-red-100 text-red-700'];
                return (
                  <div key={index} className={`p-4 rounded-xl ${colors[index % colors.length]}`}>
                    <p className="text-sm font-medium opacity-80">{item.priceRange}</p>
                    <p className="text-2xl font-bold mt-1">{item.count}</p>
                    <p className="text-xs opacity-70">vehicles</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={DollarSign} message="No price data available" />
          )}
        </div>

        {/* Blog Performance */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Blog Performance
          </h3>
          {blogStats?.topPerforming?.length > 0 ? (
            <div className="space-y-3">
              {blogStats.topPerforming.slice(0, 5).map((blog, index) => (
                <div key={blog.id} className="flex items-center gap-3 p-3 bg-[var(--color-elevated)] rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-primary text-secondary text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{blog.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">{blog.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--color-muted)]">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatNumber(blog.viewCount)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={FileText} message="No blog data available" />
          )}
        </div>
      </div>

      {/* Sales Funnel & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selling To Us Stats */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Sell To Us Pipeline
          </h3>
          {dashboardStats?.sellingToUs ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[var(--color-elevated)] rounded-xl text-center">
                  <p className="text-3xl font-bold text-[var(--color-text)]">{dashboardStats.sellingToUs.total}</p>
                  <p className="text-sm text-[var(--color-muted)]">Total Submissions</p>
                </div>
                <div className="p-4 bg-[var(--color-elevated)] rounded-xl text-center">
                  <p className="text-3xl font-bold text-[var(--color-text)]">{dashboardStats.sellingToUs.thisMonth}</p>
                  <p className="text-sm text-[var(--color-muted)]">This Month</p>
                  {getChangeIndicator(dashboardStats.sellingToUs.change)}
                </div>
              </div>
              <div className="space-y-2">
                <StatusBar label="Pending" value={dashboardStats.sellingToUs.pending} total={dashboardStats.sellingToUs.total} color="bg-amber-500" />
                <StatusBar label="Offer Sent" value={dashboardStats.sellingToUs.offerSent} total={dashboardStats.sellingToUs.total} color="bg-blue-500" />
                <StatusBar label="Accepted" value={dashboardStats.sellingToUs.accepted} total={dashboardStats.sellingToUs.total} color="bg-emerald-500" />
                <StatusBar label="Rejected" value={dashboardStats.sellingToUs.rejected} total={dashboardStats.sellingToUs.total} color="bg-red-500" />
              </div>
            </div>
          ) : (
            <EmptyState icon={ShoppingCart} message="No submission data available" />
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </h3>
          {dashboardStats?.recentActivity ? (
            <div className="space-y-4">
              <ActivityItem
                icon={<Users className="w-5 h-5" />}
                label="New Users This Month"
                value={dashboardStats.recentActivity.newUsersThisMonth}
                color="bg-blue-100 text-blue-600"
              />
              <ActivityItem
                icon={<MessageSquare className="w-5 h-5" />}
                label="Comments This Week"
                value={dashboardStats.recentActivity.newCommentsThisWeek}
                color="bg-emerald-100 text-emerald-600"
              />
              <ActivityItem
                icon={<Star className="w-5 h-5" />}
                label="Reviews This Week"
                value={dashboardStats.recentActivity.newReviewsThisWeek}
                color="bg-amber-100 text-amber-600"
              />
              <ActivityItem
                icon={<Mail className="w-5 h-5" />}
                label="Newsletter Subscribers"
                value={dashboardStats.engagement?.newsletterSubscribers || 0}
                color="bg-purple-100 text-purple-600"
              />
            </div>
          ) : (
            <EmptyState icon={Activity} message="No activity data available" />
          )}
        </div>
      </div>

      {/* Blog Categories & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blog by Category */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Blogs by Category
          </h3>
          {blogStats?.byCategory?.length > 0 ? (
            <div className="space-y-3">
              {blogStats.byCategory.map((item, index) => {
                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500'];
                const total = blogStats.byCategory.reduce((acc, curr) => acc + parseInt(curr.count), 0);
                const percentage = ((parseInt(item.count) / total) * 100).toFixed(1);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[var(--color-text)]">{item.category || 'Uncategorized'}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--color-muted)]">{formatNumber(item.totalViews || 0)} views</span>
                        <span className="text-sm text-[var(--color-muted)] font-medium">{item.count}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-[var(--color-elevated)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={FileText} message="No category data available" />
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Quick Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickStatBox
              label="Cars Sold This Month"
              value={dashboardStats?.cars?.soldThisMonth || 0}
              icon={<Car className="w-5 h-5" />}
              trend={dashboardStats?.cars?.salesChange}
            />
            <QuickStatBox
              label="Draft Blogs"
              value={dashboardStats?.blogs?.drafts || 0}
              icon={<FileText className="w-5 h-5" />}
            />
            <QuickStatBox
              label="Pending Reviews"
              value={dashboardStats?.engagement?.pendingReviews || 0}
              icon={<Star className="w-5 h-5" />}
            />
            <QuickStatBox
              label="Pending Comments"
              value={dashboardStats?.engagement?.pendingComments || 0}
              icon={<MessageSquare className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subValue, icon, color, change }) => {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[var(--color-muted)] text-sm">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{value}</p>
          {subValue && <p className="text-xs text-[var(--color-muted)] mt-1">{subValue}</p>}
          {change !== undefined && (
            <div className="mt-2">
              <span className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change).toFixed(1)}% vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`${color} text-white p-3 rounded-xl`}>{icon}</div>
      </div>
    </div>
  );
};

// Status Bar Component
const StatusBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--color-muted)] w-24">{label}</span>
      <div className="flex-1 h-6 bg-[var(--color-elevated)] rounded-lg overflow-hidden relative">
        <div
          className={`h-full ${color} rounded-lg transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[var(--color-text)]">
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-[var(--color-elevated)] rounded-xl">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <p className="text-lg font-bold text-[var(--color-text)]">{value}</p>
      </div>
    </div>
  );
};

// Quick Stat Box Component
const QuickStatBox = ({ label, value, icon, trend }) => {
  return (
    <div className="p-4 bg-[var(--color-elevated)] rounded-xl">
      <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
      {trend !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-medium mt-1 ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ icon, message }) => {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[var(--color-muted)]">
      <div className="w-12 h-12 rounded-full bg-[var(--color-elevated)] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default AdminAnalytics;
