import React, { useState, useEffect } from 'react';
import AdminDashboardContent from '../components/admin/AdminDashboardContent';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminListings from '../components/admin/AdminListings';
import AdminBookings from '../components/admin/AdminBookings';
import AdminLocations from '../components/admin/AdminLocations';
import AdminBlogs from '../components/admin/AdminBlogs';
import AdminStaff from '../components/admin/AdminStaff';
import AdminUsers from '../components/admin/AdminUsers';
import AdminNewsTeller from '../components/admin/AdminNewsTeller';
import AdminComments from '../components/admin/AdminComments';
import Adminreviews from '../components/admin/Adminreviews';
import UserDetailPage from '../components/admin/UserDetailPAge';
import AdminAnalytics from '../components/admin/AdminAnalytics';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section) setActiveSection(section);
  }, []);

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    const params = new URLSearchParams(window.location.search);
    params.set('section', section);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Overview':
        return <AdminDashboardContent setActiveSection={handleSetActiveSection} />;
      case 'Bookings':
        return <AdminBookings />;
      case 'Listings':
        return <AdminListings />;
      case 'Locations':
        return <AdminLocations />;
      case 'Blogs':
        return <AdminBlogs />;
      case 'Staffs':
        return <AdminStaff />;
      case 'Users':
        return (
          <AdminUsers
            setActiveSection={handleSetActiveSection}
            setSelectedUser={setSelectedUser}
          />
        );
      case 'Newsteller':
        return <AdminNewsTeller />;
      case 'Comments':
        return <AdminComments />;
      case 'Reviews':
        return <Adminreviews />;
      case 'Analytics':
        return <AdminAnalytics />;
      case 'user-profile':
        return (
          <UserDetailPage
            user={selectedUser}
            setActiveSection={handleSetActiveSection}
          />
        );
      default:
        return <AdminDashboardContent setActiveSection={handleSetActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden text-[var(--color-text)]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={handleSetActiveSection}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AdminHeader
            toggleSidebar={() => setIsSidebarOpen(true)}
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
          />

          <div className="mt-4">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
