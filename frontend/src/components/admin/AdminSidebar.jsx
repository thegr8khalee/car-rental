// src/components/Admin/AdminSidebar.jsx
import React from 'react';
import {
  LogOut,
  UserRound,
  X,
  LayoutDashboard,
  Car,
  CalendarCheck,
  MapPin,
  FileText,
  Users,
  UserCog,
  Mail,
  MessageSquare,
  Star,
  BarChart3,
  Zap,
} from 'lucide-react';
import { useUserAuthStore } from '../../store/useUserAuthStore';

const AdminSidebar = ({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  closeSidebar,
}) => {
  const { authUser, logout } = useUserAuthStore();

  const navItems = [
    { id: 'Overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'Bookings', name: 'Bookings', icon: CalendarCheck },
    { id: 'Listings', name: 'Fleet', icon: Car },
    { id: 'Locations', name: 'Locations', icon: MapPin },
    { id: 'Users', name: 'Customers', icon: Users },
    { id: 'Reviews', name: 'Reviews', icon: Star },
    { id: 'Analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'Blogs', name: 'Blogs', icon: FileText },
    { id: 'Newsteller', name: 'Broadcasts', icon: Mail },
    { id: 'Comments', name: 'Comments', icon: MessageSquare },
    { id: 'Staffs', name: 'Staff', icon: UserCog },
  ];

  const handleNavigationClick = (sectionId) => {
    setActiveSection(sectionId);
    closeSidebar();
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50
        w-72 bg-[var(--color-surface)] text-[var(--color-text)] flex flex-col
        border-r border-[var(--color-border-subtle)]
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center text-black">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg tracking-tight">Velocity</h1>
              <p className="text-xs text-[var(--color-muted)]">Admin</p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-[var(--color-elevated)] rounded-lg transition-colors"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigationClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 group
                    ${isActive
                      ? 'bg-[var(--color-accent)]/12 text-[var(--color-accent)]'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text)]'
                    }
                  `}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[var(--color-accent)]' : ''}`} size={16} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-elevated)] mb-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center">
            {authUser?.avatar ? (
              <img src={authUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <UserRound className="w-4 h-4 text-[var(--color-accent)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{authUser?.username || 'Admin'}</p>
            <p className="text-xs text-[var(--color-muted)] capitalize">{authUser?.role || 'Administrator'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
