// AdminNewsletter.jsx
import React, { useEffect } from 'react';
import {
  Mail,
  TrendingUp,
  Send,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminOpsStore } from '../../store/useAdminOpsStore';

const AdminNewsletter = () => {
  const {
    getNewsletterStats,
    getRecentBroadcasts,
    newsletterStats,
    recentBroadcasts,
    totalBroadcastPages,
    currentBroadcastPage,
    isFetchingNewsletter,
    newsletterError,
  } = useAdminOpsStore();

  console.log(newsletterStats)

  const navigate = useNavigate();

  useEffect(() => {
    getNewsletterStats();
    getRecentBroadcasts({ page: 1, limit: 10 });
  }, [getNewsletterStats, getRecentBroadcasts]);

  const handlePageChange = (page) => {
    getRecentBroadcasts({ page, limit: 10 });
  };

  const handleNewBroadcast = () => {
    navigate('/admin/broadcast/new');
  };

  if (isFetchingNewsletter && !newsletterStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-[var(--color-elevated)] rounded animate-pulse" />
                  <div className="h-8 w-16 bg-[var(--color-elevated)] rounded animate-pulse" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-elevated)] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-40 bg-[var(--color-elevated)] rounded animate-pulse" />
            <div className="h-10 w-36 bg-[var(--color-elevated)] rounded-xl animate-pulse" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-[var(--color-elevated)] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (newsletterError && !newsletterStats) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">Error: {newsletterError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)]">Newsletter Management</h1>
          <p className="text-sm text-[var(--color-muted)]">Manage subscribers and broadcasts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Subscribers"
          value={newsletterStats?.totalSubscribers || 0}
          icon={<Users className="w-5 h-5" />}
          color="bg-blue-500"
        />
        <StatCard
          title="New This Month"
          value={newsletterStats?.newThisMonth || 0}
          icon={<TrendingUp className="w-5 h-5" />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Total Broadcasts"
          value={newsletterStats?.totalBroadcasts || 0}
          icon={<Send className="w-5 h-5" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Unsubscribed"
          value={newsletterStats?.unsubscribedCount || 0}
          icon={<Mail className="w-5 h-5" />}
          color="bg-red-500"
        />
      </div>

      {/* Recent Broadcasts Section */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Recent Broadcasts</h2>
          <button
            onClick={handleNewBroadcast}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            New Broadcast
          </button>
        </div>

        {/* Broadcasts List */}
        {recentBroadcasts?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
              <Send className="w-8 h-8 text-[var(--color-muted)]" />
            </div>
            <p className="text-[var(--color-muted)]">No broadcasts sent yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBroadcasts?.map((broadcast) => (
              <BroadcastCard key={broadcast.id} broadcast={broadcast} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalBroadcastPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentBroadcastPage - 1)}
              disabled={currentBroadcastPage === 1}
              className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalBroadcastPages)]
              .map((_, index) => index + 1)
              .filter(
                (page) =>
                  page >= currentBroadcastPage - 2 &&
                  page <= currentBroadcastPage + 2
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-xl font-medium transition-colors ${
                    page === currentBroadcastPage
                      ? 'bg-primary text-secondary'
                      : 'bg-[var(--color-elevated)] hover:bg-[var(--color-elevated)] text-[var(--color-text)]'
                  }`}
                >
                  {page}
                </button>
              ))}
            <button
              onClick={() => handlePageChange(currentBroadcastPage + 1)}
              disabled={currentBroadcastPage === totalBroadcastPages}
              className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[var(--color-muted)] text-sm">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-xl`}>{icon}</div>
      </div>
    </div>
  );
};

const BroadcastCard = ({ broadcast }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { text: 'Completed', class: 'bg-emerald-100 text-emerald-700' },
      sending: { text: 'Sending', class: 'bg-amber-100 text-amber-700' },
      failed: { text: 'Failed', class: 'bg-red-100 text-red-700' },
      draft: { text: 'Draft', class: 'bg-[var(--color-elevated)] text-[var(--color-muted)]' },
    };
    return statusConfig[status] || statusConfig.draft;
  };

  const statusBadge = getStatusBadge(broadcast.status);

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-4 hover:border-[var(--color-border-subtle)] hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--color-text)] text-lg">{broadcast.subject}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(broadcast.sentAt || broadcast.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {broadcast.recipientCount} recipients
            </span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>{statusBadge.text}</span>
      </div>

      {broadcast.status === 'completed' && (
        <div className="flex gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            {broadcast.successCount} sent
          </span>
          {broadcast.failureCount > 0 && (
            <span className="flex items-center gap-1.5 text-red-600">
              <XCircle className="w-4 h-4" />
              {broadcast.failureCount} failed
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
