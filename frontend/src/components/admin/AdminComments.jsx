// AdminComments.jsx
import React, { useEffect, useState } from 'react';
import Skeleton from '../Skeleton';
import { useDashboardStore } from '../../store/useDasboardStore';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

const AdminComments = () => {
  const {
    getCommentsStats,
    getComments,
    commentsStats,
    comments,
    totalCommentPages,
    currentCommentPage,
    // eslint-disable-next-line no-unused-vars
    commentFilter,
    isFetchingComments,
    commentError,
  } = useDashboardStore();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    getCommentsStats();
    getComments({ page: 1, limit: 10, status: selectedFilter });
  }, [getCommentsStats, getComments, selectedFilter]);

  const handlePageChange = (page) => {
    getComments({ page, limit: 10, status: selectedFilter });
  };

  const handleFilterChange = (status) => {
    setSelectedFilter(status);
    setIsFilterOpen(false);
    getComments({ page: 1, limit: 10, status });
  };

  const getFilterLabel = () => {
    if (selectedFilter === 'all') return 'All Comments';
    return selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1);
  };

  if (isFetchingComments && !commentsStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
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
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-[var(--color-elevated)] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (commentError && !commentsStats) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">Error: {commentError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)]">Comment Management</h1>
          <p className="text-sm text-[var(--color-muted)]">Review and moderate user comments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Comments"
          value={commentsStats?.totalComments || 0}
          icon={<MessageSquare className="w-5 h-5" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending"
          value={commentsStats?.pendingComments || 0}
          icon={<Clock className="w-5 h-5" />}
          color="bg-amber-500"
        />
        <StatCard
          title="Approved"
          value={commentsStats?.approvedComments || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Rejected"
          value={commentsStats?.rejectedComments || 0}
          icon={<XCircle className="w-5 h-5" />}
          color="bg-red-500"
        />
        <StatCard
          title="Spam"
          value={commentsStats?.spamComments || 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="bg-orange-500"
        />
      </div>

      {/* Comments Section */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Comments</h2>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-elevated)] hover:bg-[var(--color-elevated)] rounded-xl transition-colors font-medium text-[var(--color-text)]"
            >
              <Filter className="w-4 h-4" />
              {getFilterLabel()}
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                {['all', 'pending', 'approved', 'rejected', 'spam'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className={`w-full text-left px-4 py-2 hover:bg-[var(--color-elevated)] transition-colors ${
                      selectedFilter === status ? 'text-primary font-medium' : 'text-[var(--color-text)]'
                    }`}
                  >
                    {status === 'all' ? 'All Comments' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments List */}
        {comments?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-[var(--color-muted)]" />
            </div>
            <p className="text-[var(--color-muted)]">No comments found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments?.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalCommentPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentCommentPage - 1)}
              disabled={currentCommentPage === 1}
              className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalCommentPages)]
              .map((_, index) => index + 1)
              .filter(
                (page) =>
                  page >= currentCommentPage - 2 &&
                  page <= currentCommentPage + 2
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-xl font-medium transition-colors ${
                    page === currentCommentPage
                      ? 'bg-primary text-secondary'
                      : 'bg-[var(--color-elevated)] hover:bg-[var(--color-elevated)] text-[var(--color-text)]'
                  }`}
                >
                  {page}
                </button>
              ))}
            <button
              onClick={() => handlePageChange(currentCommentPage + 1)}
              disabled={currentCommentPage === totalCommentPages}
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

const CommentCard = ({ comment }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = React.useRef(null);
  const { updateCommentStatus, isUpdatingComment } = useDashboardStore();

  React.useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }
  }, [isDropDownOpen]);

  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateCommentStatus(comment.id, newStatus);
      setIsDropDownOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

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
      pending: { text: 'Pending', class: 'bg-amber-100 text-amber-700' },
      approved: { text: 'Approved', class: 'bg-emerald-100 text-emerald-700' },
      rejected: { text: 'Rejected', class: 'bg-red-100 text-red-700' },
      spam: { text: 'Spam', class: 'bg-[var(--color-elevated)] text-[var(--color-muted)]' },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const statusBadge = getStatusBadge(comment.status);

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 hover:border-[var(--color-border-subtle)] transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-semibold text-[var(--color-text)]">{comment.username}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>{statusBadge.text}</span>
              {comment.isEdited && (
                <span className="text-xs text-[var(--color-muted)]">(edited)</span>
              )}
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              on: <span className="text-[var(--color-text)]">{comment.blog?.title || 'Unknown Blog'}</span>
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          
          <button
            onClick={handleDropDownClick}
            className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] transition-colors flex-shrink-0"
            disabled={isUpdatingComment}
          >
            <ChevronDown className={`w-5 h-5 text-[var(--color-muted)] transition-transform duration-300 ${
              isDropDownOpen ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        <p className="text-sm text-[var(--color-text)] mt-2 whitespace-pre-wrap">{comment.content}</p>
      </div>

      {/* Dropdown Actions */}
      <div
        ref={dropdownRef}
        className="transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-100"
        style={{
          maxHeight: isDropDownOpen ? `${dropdownHeight}px` : '0px',
          opacity: isDropDownOpen ? 1 : 0,
          borderTopWidth: isDropDownOpen ? '1px' : '0px',
        }}
      >
        <div className="grid grid-cols-2 gap-3 p-4 bg-[var(--color-elevated)]">
          <button
            onClick={() => handleStatusChange('approved')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={comment.status === 'approved' || isUpdatingComment}
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={comment.status === 'rejected' || isUpdatingComment}
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={() => handleStatusChange('spam')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={comment.status === 'spam' || isUpdatingComment}
          >
            <AlertTriangle className="w-4 h-4" />
            Mark Spam
          </button>
          <button
            onClick={() => handleStatusChange('pending')}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-[var(--color-surface)] text-[var(--color-text)] font-medium rounded-xl border border-[var(--color-border-subtle)] hover:bg-[var(--color-elevated)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={comment.status === 'pending' || isUpdatingComment}
          >
            <Clock className="w-4 h-4" />
            Pending
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminComments;
