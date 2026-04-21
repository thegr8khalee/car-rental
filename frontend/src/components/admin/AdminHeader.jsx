import React from 'react';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useUserAuthStore } from '../../store/useUserAuthStore';

const TITLES = {
  Overview: 'Overview',
  Bookings: 'Bookings',
  Listings: 'Fleet',
  Locations: 'Locations',
  Users: 'Customers',
  Reviews: 'Reviews',
  Analytics: 'Analytics',
  Blogs: 'Blogs',
  Newsteller: 'Broadcasts',
  Comments: 'Comments',
  Staffs: 'Staff',
};

const AdminHeader = ({ toggleSidebar, activeSection }) => {
  const { authUser, logout } = useUserAuthStore();
  const title = TITLES[activeSection] || activeSection?.replace('-', ' ') || 'Admin';

  return (
    <header className="sticky top-0 z-30 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border-subtle)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-[var(--color-elevated)] rounded-lg"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        <div className="relative group">
          <button className="flex items-center gap-2 p-1.5 pr-3 hover:bg-[var(--color-elevated)] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center overflow-hidden">
              {authUser?.avatar ? (
                <img src={authUser.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={14} className="text-[var(--color-accent)]" />
              )}
            </div>
            <ChevronDown size={14} className="text-[var(--color-muted)] hidden sm:block" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-lg shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
              <p className="font-medium truncate">{authUser?.username || 'Admin'}</p>
              <p className="text-xs text-[var(--color-muted)] capitalize">
                {authUser?.role || 'Administrator'}
              </p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
