import React, { useState} from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Star,
  Bell,
  BellOff,
  User,
} from 'lucide-react';

const UserDetailPage = ({ user, setActiveSection }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [comments] = useState(user?.comments || []);
  const [reviews] = useState(user?.reviews || []);
  const [newsletterStatus] = useState(user?.newsletter || null);

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
      pending: { text: 'Pending', class: 'bg-amber-100 text-amber-700', icon: Clock },
      approved: { text: 'Approved', class: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      rejected: { text: 'Rejected', class: 'bg-red-100 text-red-700', icon: XCircle },
      spam: { text: 'Spam', class: 'bg-[var(--color-elevated)] text-[var(--color-muted)]', icon: AlertTriangle },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => {
      return acc + (
        (review.interiorRating || 0) +
        (review.exteriorRating || 0) +
        (review.comfortRating || 0) +
        (review.performanceRating || 0)
      ) / 4;
    }, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--color-elevated)]">
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
            <User className="w-8 h-8 text-[var(--color-muted)]" />
          </div>
          <p className="text-[var(--color-muted)]">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-elevated)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-[var(--color-elevated)] transition-colors"
              onClick={() => setActiveSection('Users')}
            >
              <ArrowLeft className="h-5 w-5 text-[var(--color-muted)]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">User Details</h1>
              <p className="text-sm text-[var(--color-muted)]">View user information and activity</p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 mb-6 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
                    <User className="w-14 h-14 text-primary" />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">{user.username}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[var(--color-elevated)] rounded-xl">
                      <Mail className="w-5 h-5 text-[var(--color-muted)]" />
                      <div>
                        <p className="text-xs text-[var(--color-muted)]">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    {user.phoneNumber && (
                      <div className="flex items-center gap-3 p-3 bg-[var(--color-elevated)] rounded-xl">
                        <Phone className="w-5 h-5 text-[var(--color-muted)]" />
                        <div>
                          <p className="text-xs text-[var(--color-muted)]">Phone</p>
                          <p className="font-medium text-[var(--color-text)]">{user.phoneNumber}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-[var(--color-elevated)] rounded-xl">
                      <Calendar className="w-5 h-5 text-[var(--color-muted)]" />
                      <div>
                        <p className="text-xs text-[var(--color-muted)]">Joined</p>
                        <p className="font-medium text-[var(--color-text)]">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[var(--color-elevated)] rounded-xl">
                      {newsletterStatus ? (
                        <Bell className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <BellOff className="w-5 h-5 text-[var(--color-muted)]" />
                      )}
                      <div>
                        <p className="text-xs text-[var(--color-muted)]">Newsletter</p>
                        <p className="font-medium text-[var(--color-text)]">
                          {newsletterStatus ? 'Subscribed' : 'Not Subscribed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Newsletter Details */}
                  {newsletterStatus && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <h3 className="font-semibold mb-2 text-emerald-800">Newsletter Subscription</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-[var(--color-muted)]">Frequency:</span>
                          <span className="ml-2 font-medium text-[var(--color-text)] capitalize">
                            {newsletterStatus.preferences?.frequency || 'Weekly'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--color-muted)]">Subscribed:</span>
                          <span className="ml-2 font-medium text-[var(--color-text)]">
                            {formatDate(newsletterStatus.createdAt)}
                          </span>
                        </div>
                        {newsletterStatus.preferences?.categories && (
                          <div className="col-span-2">
                            <span className="text-[var(--color-muted)]">Categories:</span>
                            <div className="flex gap-2 mt-1">
                              {newsletterStatus.preferences.categories.map((cat, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <p className="text-xs text-[var(--color-muted)] mb-1">Total Comments</p>
                    <p className="text-2xl font-bold text-primary">{comments.length}</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-xl">
                    <p className="text-xs text-[var(--color-muted)] mb-1">Total Reviews</p>
                    <p className="text-2xl font-bold text-secondary">{reviews.length}</p>
                  </div>
                  {reviews.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <p className="text-xs text-[var(--color-muted)] mb-1">Avg Rating</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {calculateAverageRating()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {['overview', 'comments', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-secondary'
                    : 'bg-[var(--color-surface)] hover:bg-[var(--color-elevated)] text-[var(--color-text)]'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'comments' && `Comments (${comments.length})`}
                {tab === 'reviews' && `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Comments */}
              <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Recent Comments
                  </h3>
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-[var(--color-muted)]" />
                      </div>
                      <p className="text-[var(--color-muted)] text-sm">No comments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {comments.slice(0, 3).map((comment) => {
                        const status = getStatusBadge(comment.status);
                        return (
                          <div key={comment.id} className="p-3 bg-[var(--color-elevated)] rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                                {status.text}
                              </span>
                              <span className="text-xs text-[var(--color-muted)]">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--color-text)] line-clamp-2">{comment.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-primary" />
                    Recent Reviews
                  </h3>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
                        <Star className="w-6 h-6 text-[var(--color-muted)]" />
                      </div>
                      <p className="text-[var(--color-muted)] text-sm">No reviews yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.slice(0, 3).map((review) => {
                        const avgRating = (
                          (review.interiorRating || 0) +
                          (review.exteriorRating || 0) +
                          (review.comfortRating || 0) +
                          (review.performanceRating || 0)
                        ) / 4;
                        const status = getStatusBadge(review.status);
                        
                        return (
                          <div key={review.id} className="p-3 bg-[var(--color-elevated)] rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                                  {status.text}
                                </span>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 fill-primary text-primary" />
                                  <span className="text-sm ml-1 font-medium">{avgRating.toFixed(1)}</span>
                                </div>
                              </div>
                              <span className="text-xs text-[var(--color-muted)]">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--color-text)] line-clamp-2">{review.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-[var(--color-text)] mb-4">All Comments</h3>
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[var(--color-muted)]" />
                    </div>
                    <p className="text-[var(--color-muted)]">No comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => {
                      const status = getStatusBadge(comment.status);
                      const StatusIcon = status.icon;
                      
                      return (
                        <div key={comment.id} className="p-4 bg-[var(--color-elevated)] rounded-xl">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.class}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.text}
                            </span>
                            <div className="text-right">
                              <p className="text-xs text-[var(--color-muted)]">
                                {formatDate(comment.createdAt)}
                              </p>
                              {comment.isEdited && (
                                <p className="text-xs text-[var(--color-muted)]">
                                  Edited: {formatDate(comment.editedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{comment.content}</p>
                          {comment.blogId && (
                            <p className="text-xs text-[var(--color-muted)] mt-2">
                              Blog ID: {comment.blogId}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-[var(--color-text)] mb-4">All Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
                      <Star className="w-8 h-8 text-[var(--color-muted)]" />
                    </div>
                    <p className="text-[var(--color-muted)]">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const status = getStatusBadge(review.status);
                      const StatusIcon = status.icon;
                      
                      return (
                        <div key={review.id} className="p-4 bg-[var(--color-elevated)] rounded-xl">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.class}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.text}
                            </span>
                            <div className="text-right">
                              <p className="text-xs text-[var(--color-muted)]">
                                {formatDate(review.createdAt)}
                              </p>
                              {review.isEdited && (
                                <p className="text-xs text-[var(--color-muted)]">
                                  Edited: {formatDate(review.editedAt)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Ratings */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                            {review.interiorRating && (
                              <RatingDisplay label="Interior" value={review.interiorRating} />
                            )}
                            {review.exteriorRating && (
                              <RatingDisplay label="Exterior" value={review.exteriorRating} />
                            )}
                            {review.comfortRating && (
                              <RatingDisplay label="Comfort" value={review.comfortRating} />
                            )}
                            {review.performanceRating && (
                              <RatingDisplay label="Performance" value={review.performanceRating} />
                            )}
                          </div>

                          <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{review.content}</p>
                          {review.carId && (
                            <p className="text-xs text-[var(--color-muted)] mt-2">
                              Car ID: {review.carId}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RatingDisplay = ({ label, value }) => {
  return (
    <div className="flex flex-col p-2 bg-[var(--color-surface)] rounded-lg">
      <span className="text-xs text-[var(--color-muted)]">{label}</span>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < value ? 'fill-primary text-primary' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs ml-1 font-medium text-[var(--color-text)]">{value}</span>
      </div>
    </div>
  );
};

export default UserDetailPage;
