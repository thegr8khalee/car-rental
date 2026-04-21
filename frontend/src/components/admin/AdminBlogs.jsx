// AdminBlogs.jsx
import React, { useEffect } from 'react';
import Skeleton from '../Skeleton';
import { useDashboardStore } from '../../store/useDasboardStore';
import { ChevronDown, ChevronLeft, ChevronRight, User, Calendar, Eye, FileText, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminOpsStore } from '../../store/useAdminOpsStore';

const AdminBlogs = () => {
  const {
    getBlogs,
    blogs,
    totalBlogPages,
    currentBlogPage,
    isFetchingBlogs,
    blogError,
  } = useDashboardStore();

  const [searchTerm, setSearchTerm] = React.useState('');

  console.log(blogs);

  useEffect(() => {
    getBlogs({ page: 1, limit: 10 });
  }, [getBlogs]);

  const handlePageChange = (page) => {
    const params = { page, limit: 10, search: searchTerm };
    getBlogs(params);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    getBlogs({ page: 1, limit: 10, search: searchTerm });
  };

  const navigate = useNavigate();

  const renderContent = () => {
    if (isFetchingBlogs) {
      return (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-18 bg-[var(--color-elevated)] rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-[var(--color-elevated)] rounded w-64"></div>
                  <div className="h-4 bg-[var(--color-elevated)] rounded w-40"></div>
                </div>
                <div className="h-6 bg-[var(--color-elevated)] rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (blogError) return (
      <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-700">Error loading blogs</p>
          <p className="text-sm text-red-600">{blogError}</p>
        </div>
      </div>
    );
    if (blogs?.length === 0) return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-elevated)] flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-[var(--color-muted)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No blogs found</h3>
        <p className="text-[var(--color-muted)] mb-6">Get started by creating your first blog post.</p>
        <button 
          onClick={() => navigate('/admin/blogs/new')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Create New Blog
        </button>
      </div>
    );

    return (
      <>
        {/* Blog List */}
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} item={blog} />
          ))}
        </div>

        {/* Pagination */}
        {totalBlogPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
            {currentBlogPage > 1 && (
              <button
                onClick={() => handlePageChange(currentBlogPage - 1)}
                className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                type="button"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {[...Array(totalBlogPages)]
              .map((_, index) => index + 1)
              .filter(
                (page) =>
                  page >= currentBlogPage - 2 && page <= currentBlogPage + 2,
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                    page === currentBlogPage
                      ? 'bg-primary text-secondary'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-muted)] hover:border-primary hover:text-primary'
                  }`}
                  type="button"
                >
                  {page}
                </button>
              ))}
            {currentBlogPage < totalBlogPages && (
              <button
                onClick={() => handlePageChange(currentBlogPage + 1)}
                className="h-10 px-4 rounded-xl bg-primary text-secondary font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                type="button"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </>
    );    
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">{blogs?.length} Blog Posts</h2>
            <p className="text-sm text-[var(--color-muted)]">Manage your blog content</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/blogs/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add New Blog
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search blogs by title or tagline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border-subtle)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </form>

      {renderContent()}
    </div>
  );
};

const BlogCard = ({ item }) => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(null);
  const [dropdownHeight, setDropdownHeight] = React.useState(0);
  const dropdownRef = React.useRef(null);
  const { deleteBlog, isLoading } = useAdminOpsStore();
  const { getBlogs } = useDashboardStore();

  React.useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }
  }, [isDropDownOpen]);

  const handleDropDownClick = (item) => {
    if (isDropDownOpen === item) {
      setIsDropDownOpen(null);
    } else {
      setIsDropDownOpen(item);
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/blogs/update/${id}`);
  };

  const handleDelete = (id) => {
    window.confirm('Are you sure you want to delete this blog?') &&
      deleteBlog(id).then(() => {
        getBlogs({ page: 1, limit: 10 });
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-700';
      case 'draft':
        return 'bg-amber-100 text-amber-700';
      case 'archived':
        return 'bg-[var(--color-elevated)] text-[var(--color-muted)]';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-[var(--color-elevated)] text-[var(--color-muted)]';
    }
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 hover:border-[var(--color-border-subtle)] hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 gap-4">
        <div className="w-24 h-18 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-elevated)]">
          <img
            src={item.featuredImage || '/placeholder-blog.jpg'}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--color-text)] truncate mb-1">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{item.author?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.publishedAt
                ? formatDate(item.publishedAt)
                : formatDate(item.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {item.viewCount || 0} views
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
        <button
          onClick={() => handleDropDownClick(item.id)}
          className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] transition-colors flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 text-[var(--color-muted)] transition-transform duration-300 ${
            isDropDownOpen === item.id ? 'rotate-180' : ''
          }`} />
        </button>
      </div>
      <div
        ref={dropdownRef}
        className="transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-100"
        style={{
          maxHeight: isDropDownOpen === item.id ? `${dropdownHeight}px` : '0px',
          opacity: isDropDownOpen === item.id ? 1 : 0,
          borderTopWidth: isDropDownOpen === item.id ? '1px' : '0px',
        }}
      >
        <div className="flex gap-3 p-4 bg-[var(--color-elevated)]">
          <button
            onClick={() => handleEdit(item.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] text-red-600 font-semibold rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
