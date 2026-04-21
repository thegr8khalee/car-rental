// AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '../../store/useDasboardStore';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Users,
  Mail,
  Phone,
  Calendar,
  Search,
  XCircle,
} from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const AdminUsers = ({ setActiveSection, setSelectedUser }) => {
  const {
    getUsers,
    users,
    totalUserPages,
    currentUserPage,
    isFetchingUsers,
    userError,
  } = useDashboardStore();

  const [searchTerm, setSearchTerm] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    getUsers({ page: 1, limit: 10 });
  }, [getUsers]);

  const handlePageChange = (page) => {
    getUsers({ page, limit: 10, search: searchTerm });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getUsers({ page: 1, limit: 10, search: searchTerm });
  };

  const renderContent = () => {
    if (isFetchingUsers) {
      return (
        <div className="space-y-6">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-elevated)] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-[var(--color-elevated)] rounded animate-pulse" />
                    <div className="h-4 w-48 bg-[var(--color-elevated)] rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    if (userError)
      return (
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">Error: {userError}</p>
        </div>
      );

    if (users?.length === 0) {
      return (
        <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-elevated)] flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-[var(--color-muted)]" />
          </div>
          <p className="text-[var(--color-muted)]">No users found.</p>
        </div>
      );
    }

    return (
      <>
        {/* Users List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {users?.map((user) => (
            <UserCard
              key={user.id}
              item={user}
              setActiveSection={setActiveSection}
              setSelectedUser={setSelectedUser}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalUserPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentUserPage - 1)}
              disabled={currentUserPage === 1}
              className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalUserPages)]
              .map((_, index) => index + 1)
              .filter(
                (page) =>
                  page >= currentUserPage - 2 && page <= currentUserPage + 2
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-xl font-medium transition-colors ${
                    page === currentUserPage
                      ? 'bg-primary text-secondary'
                      : 'bg-[var(--color-elevated)] hover:bg-[var(--color-elevated)] text-[var(--color-text)]'
                  }`}
                >
                  {page}
                </button>
              ))}
            <button
              onClick={() => handlePageChange(currentUserPage + 1)}
              disabled={currentUserPage === totalUserPages}
              className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)]">User Management</h1>
          <p className="text-sm text-[var(--color-muted)]">{users?.length || 0} registered user{users?.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-11 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Search
        </button>
      </form>

      {renderContent()}
    </div>
  );
};

const UserCard = ({ item, setActiveSection, setSelectedUser }) => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const { deleteUser } = useDashboardStore();
  const [dropdownHeight, setDropdownHeight] = React.useState(0);
  const dropdownRef = React.useRef(null);
  // const navigate = useNavigate();

  React.useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }
  }, [isDropDownOpen]);

  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleViewDetails = async (id) => {
    console.log('View details for user ID:', id);
    const { getUserWithDetails } = useDashboardStore.getState();
    const userWithDetails = await getUserWithDetails(id);

    if (userWithDetails) {
      setSelectedUser(userWithDetails);
      setActiveSection('user-profile');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 hover:border-[var(--color-border-subtle)] transition-all duration-200 overflow-hidden">
      <div className="w-full flex items-center justify-between p-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-[var(--color-elevated)] flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-7 h-7 text-[var(--color-muted)]" />
        </div>

        {/* User Info */}
        <div className="flex-1 px-4">
          <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
            {item.username}
          </h2>
          <div className="flex flex-col gap-1 text-sm text-[var(--color-muted)] mt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {item.email}
            </span>
            {item.phoneNumber && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                {item.phoneNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Joined: {formatDate(item.createdAt)}
          </p>
        </div>

        {/* Dropdown Button */}
        <button
          onClick={handleDropDownClick}
          className="w-9 h-9 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center hover:bg-[var(--color-elevated)] transition-colors flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 text-[var(--color-muted)] transition-transform duration-300 ${
            isDropDownOpen ? 'rotate-180' : ''
          }`} />
        </button>
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
        <div className="flex p-4 gap-3">
          <button
            onClick={() => handleViewDetails(item.id)}
            className="flex-1 px-4 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="flex-1 px-4 py-2.5 bg-[var(--color-surface)] text-red-600 font-semibold rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
