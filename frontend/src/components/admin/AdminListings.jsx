import React, { useEffect } from 'react';
import Skeleton from '../Skeleton';
import { useDashboardStore } from '../../store/useDasboardStore';
import { ChevronDown, ChevronLeft, ChevronRight, User, Plus, Car, Edit2, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminOpsStore } from '../../store/useAdminOpsStore';
import CarSearchBar from '../Searchbar';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'bg-emerald-100 text-emerald-700';
    case 'reserved':
      return 'bg-amber-100 text-amber-700';
    case 'sold':
      return 'bg-red-100 text-red-700';
    case 'preparing':
      return 'bg-blue-100 text-blue-700';
    case 'acquired':
      return 'bg-[var(--color-elevated)] text-[var(--color-text)]';
    case 'maintenance':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-emerald-100 text-emerald-700';
  }
};

const AdminListings = () => {
  const {
    getListings,
    listings,
    totalPages,
    currentPage,
    isFetchingListings,
    listingError,
  } = useDashboardStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    getListings({ page: 1, limit: 10 });
  }, [getListings]);

  console.log(listings);

  const handlePageChange = (page) => {
    const params = { page, search: searchTerm };
    getListings(params);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    getListings({ page: 1, limit: 10, search: searchTerm });
  };

  const navigate = useNavigate();

  const renderContent = () => {
    if (isFetchingListings) {
      return (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-18 bg-[var(--color-elevated)] rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-[var(--color-elevated)] rounded w-48"></div>
                  <div className="h-4 bg-[var(--color-elevated)] rounded w-32"></div>
                </div>
                <div className="h-6 bg-[var(--color-elevated)] rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (listingError) return (
      <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <Car className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-700">Error loading listings</p>
          <p className="text-sm text-red-600">{listingError}</p>
        </div>
      </div>
    );
    if (listings.length === 0) return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-elevated)] flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-[var(--color-muted)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No listings found</h3>
        <p className="text-[var(--color-muted)] mb-6">Get started by adding your first vehicle listing.</p>
        <button 
          onClick={() => navigate('/admin/cars/new')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add New Listing
        </button>
      </div>
    );
    return (
      <>
        {/* Listings */}
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
          {listings.map((listing) => (
            <ListCard key={listing.id} item={listing} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                type="button"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {[...Array(totalPages)]
              .map((_, index) => index + 1)
              .filter(
                (page) => page >= currentPage - 2 && page <= currentPage + 2,
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-secondary'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-muted)] hover:border-primary hover:text-primary'
                  }`}
                  type="button"
                >
                  {page}
                </button>
              ))}
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">{listings.length} Listings</h2>
            <p className="text-sm text-[var(--color-muted)]">Manage your vehicle inventory</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/cars/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add New Listing
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search listings by make, model, year..."
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

const ListCard = ({ item }) => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(null);
  const [dropdownHeight, setDropdownHeight] = React.useState(0);
  const dropdownRef = React.useRef(null);
  const { deleteCar } = useAdminOpsStore();
  const { getListings } = useDashboardStore();

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
    navigate(`/admin/cars/update/${id}`);
  };
  const handleDelete = (id) => {
    window.confirm('Are you sure you want to delete this listing?') &&
      deleteCar(id).then(() => {
        getListings({ page: 1, limit: 10 });
      });
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-gray-100 hover:border-[var(--color-border-subtle)] hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 gap-4">
        <div className="w-24 h-18 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-elevated)]">
          <img 
            src={item.imageUrls[0]} 
            alt={`${item.make} ${item.model}`} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--color-text)] truncate">
            {item.make} {item.model} {item.year}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-bold text-primary">₦{item.price.toLocaleString()}</span>
            {item.stockNumber && (
              <span className="text-xs px-2 py-0.5 bg-[var(--color-elevated)] text-[var(--color-muted)] rounded-full">
                #{item.stockNumber}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-[var(--color-muted)]">
            <User className="w-3.5 h-3.5" />
            <span className="capitalize">{item.condition}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getStatusColor(
          item.status || (item.sold ? 'sold' : 'available'),
        )}`}>
          {item.status || (item.sold ? 'Sold' : 'Available')}
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminListings;
