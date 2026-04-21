import React, { useEffect, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import AdminLoginProtectedRoute from './components/AdminLoginProtectedRoute';
import { useUserAuthStore } from './store/useUserAuthStore';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import MergedNavbar from './components/MergedNav';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Listings = React.lazy(() => import('./pages/Listings'));
const CarDetails = React.lazy(() => import('./pages/CarDetails'));
const Blogs = React.lazy(() => import('./pages/Blogs'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));
const AdminLoginPage = React.lazy(() => import('./pages/AdminLoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AddCarPage = React.lazy(() => import('./pages/AddCarPage'));
const UpdateCarPage = React.lazy(() => import('./pages/UpdateCarPage'));
const AddBlogPage = React.lazy(() => import('./pages/AddBlogPage'));
const UpdateBlogPage = React.lazy(() => import('./pages/UpdateBlogPage'));
const CompareCars = React.lazy(() => import('./pages/CompareCars'));
const Contact = React.lazy(() => import('./pages/Contact'));
const BookingFlow = React.lazy(() => import('./pages/Booking/BookingFlow'));
const AddStaffPage = React.lazy(() => import('./pages/addStaffPage'));
const EditStaffPage = React.lazy(() => import('./pages/editStaffPage'));
const NewBroadcastPage = React.lazy(() => import('./pages/newBroadcast'));
const Makes = React.lazy(() => import('./pages/Makes'));
const Categories = React.lazy(() => import('./pages/Categories'));
const About = React.lazy(() => import('./pages/About'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const EmailVerificationSentPage = React.lazy(() => import('./pages/EmailVerificationSentPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const { checkAuth, authUser } = useUserAuthStore();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log('Authenticated User:', authUser);

  // Determine if the footer should be visible
  const showFooter = !location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {/* <Navbar className="z-100" /> */}
      {showFooter && <MergedNavbar className="z-100" />}
      <main className="flex-grow">
       <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/signup"
              element={!authUser ? <SignupPage /> : <Navigate to={'/'} />}
            />
            <Route
              path="/verify-email-sent"
              element={<EmailVerificationSentPage />}
            />
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <LoginPage />}
            />
            <Route path="/listings" element={<Listings />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/compare" element={<CompareCars />} />
            <Route path="/makes" element={<Makes />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/profile" />}
            />
            <Route
              path="/booking"
              element={authUser ? <BookingFlow /> : <Navigate to="/login" />}
            />

            {/** admin routes */}
            <Route element={<AdminLoginProtectedRoute />}>
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/cars/new" element={<AddCarPage />} />
              <Route path="/admin/cars/update/:id" element={<UpdateCarPage />} />
              <Route path="/admin/blogs/new" element={<AddBlogPage />} />
              <Route
                path="/admin/blogs/update/:id"
                element={<UpdateBlogPage />}
              />
              <Route path="/admin/staff/add" element={<AddStaffPage />} />
              <Route path="/admin/staff/edit/:id" element={<EditStaffPage />} />
              <Route path="/admin/broadcast/new" element={<NewBroadcastPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
       </ErrorBoundary>

        <Toaster />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
