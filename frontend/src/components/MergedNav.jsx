import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Zap } from 'lucide-react';
import { useUserAuthStore } from '../store/useUserAuthStore';
import { Button } from './ui/Button';
import { cn } from './ui/cn';

const NAV_LINKS = [
  { to: '/listings', label: 'Fleet' },
  { to: '/categories', label: 'Categories' },
  { to: '/blogs', label: 'Guides' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const MergedNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser, logout } = useUserAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout?.();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-[var(--color-bg)]/85 backdrop-blur-xl border-b border-[var(--color-border-subtle)]'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)] text-[#04121a] shadow-[0_8px_24px_-10px_rgba(34,211,238,0.7)] group-hover:scale-105 transition-transform">
            <Zap size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
            Velocity
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[var(--color-text)] bg-[var(--color-elevated)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {authUser ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] pl-2 pr-3 py-1.5 hover:border-[var(--color-accent)]/40 transition-colors"
              >
                <span className="h-7 w-7 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center text-xs font-semibold">
                  {(authUser.username || authUser.email || 'U')
                    .slice(0, 1)
                    .toUpperCase()}
                </span>
                <span className="hidden sm:inline text-sm text-[var(--color-text)]">
                  {authUser.username || 'Account'}
                </span>
              </button>
              <AnimatePresence>
                {userOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-xl z-50 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-elevated)]"
                      >
                        <User size={16} /> My account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)]"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text)]"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)]"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-elevated)] rounded-lg"
                >
                  {l.label}
                </Link>
              ))}
              {!authUser && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      Get started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MergedNav;
