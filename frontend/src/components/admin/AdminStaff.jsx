// AdminStaff.jsx
import React, { useEffect } from 'react';
import Skeleton from '../Skeleton';
import { useDashboardStore } from '../../store/useDasboardStore';
import { ChevronDown, ChevronLeft, ChevronRight, UserPlus, Shield, Mail, Users, Edit2, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStaffStore } from '../../store/useAdminStaffStore';

const AdminStaff = () => {
  const {
    getStaffs,
    staffs,
    totalStaffPages,
    currentStaffPage,
    isFetchingStaffs,
    staffError,
  } = useDashboardStore();

  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getStaffs({ page: 1, limit: 10 });
  }, [getStaffs]);

  console.log(staffs);

  const handlePageChange = (page) => {
    getStaffs({ page, limit: 10, search: searchTerm });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    getStaffs({ page: 1, limit: 10, search: searchTerm });
  };

  const handleAddStaff = () => {
    navigate('/admin/staff/add');
  };

  const renderContent = () => {
    if (isFetchingStaffs) {
      return (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[var(--color-elevated)] rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-[var(--color-elevated)] rounded w-40"></div>
                  <div className="h-4 bg-[var(--color-elevated)] rounded w-56"></div>
                </div>
                <div className="h-6 bg-[var(--color-elevated)] rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (staffError) return (
      <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-700">Error loading staff</p>
          <p className="text-sm text-red-600">{staffError}</p>
        </div>
      </div>
    );

    if (staffs?.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-elevated)] flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[var(--color-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No staff members found</h3>
          <p className="text-[var(--color-muted)] mb-6">Start by adding your first team member.</p>
          <button 
            onClick={handleAddStaff}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <UserPlus className="w-5 h-5" />
            Add Staff Member
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Staff List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {staffs?.map((staff) => <StaffCard key={staff.id} item={staff} />)}
        </div>

        {/* Pagination */}
        {totalStaffPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
            {currentStaffPage > 1 && (
              <button
                onClick={() => handlePageChange(currentStaffPage - 1)}
                className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                type="button"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {[...Array(totalStaffPages)]
              .map((_, index) => index + 1)
              .filter(
                (page) =>
                  page >= currentStaffPage - 2 && page <= currentStaffPage + 2
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                    page === currentStaffPage
                      ? 'bg-primary text-secondary'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-muted)] hover:border-primary hover:text-primary'
                  }`}
                  type="button"
                >
                  {page}
                </button>
              ))}
            {currentStaffPage < totalStaffPages && (
              <button
                onClick={() => handlePageChange(currentStaffPage + 1)}
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
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">{staffs?.length || 0} Staff Members</h2>
            <p className="text-sm text-[var(--color-muted)]">Manage your team</p>
          </div>
        </div>
        <button
          onClick={handleAddStaff}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-5 h-5" />
          Add New Staff
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search staff by username, email or position..."
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

const StaffCard = ({ item }) => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const [dropdownHeight, setDropdownHeight] = React.useState(0);
  const dropdownRef = React.useRef(null);
  const { deleteStaff, isLoading } = useAdminStaffStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }
  }, [isDropDownOpen]);

  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleEdit = (id) => {
    navigate(`/admin/staff/edit/${id}`);
  };

  const handleDelete = (id) => {
    window.confirm('Are you sure you want to delete this staff member?') &&
      deleteStaff(id);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-700';
      case 'editor':
        return 'bg-blue-100 text-blue-700';
      case 'moderator':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-[var(--color-elevated)] text-[var(--color-muted)]';
    }
  };

  const formatRole = (role) => {
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 hover:border-[var(--color-border-subtle)] hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[var(--color-elevated)] ring-2 ring-gray-200">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Staff Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-[var(--color-text)]">
              {item.name}
            </h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${getRoleBadgeColor(item.role)}`}>
              <Shield className="w-3 h-3" />
              {formatRole(item.role)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Mail className="w-4 h-4" />
            <span className="truncate">{item.email}</span>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Joined {formatDate(item.createdAt)}
          </p>
        </div>

        {/* Status */}
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />

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

export default AdminStaff;
