import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useUserAuthStore } from '../store/useUserAuthStore.js';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const { authUser, isAdmin, login, isLoading, authError } = useUserAuthStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authUser && isAdmin) navigate('/admin/dashboard');
    else if (authUser) navigate('/profile');
  }, [authUser, isAdmin, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result?.success) navigate('/profile');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Left — form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-10 text-[var(--color-text)]"
          >
            <div className="h-9 w-9 rounded-lg bg-[var(--color-accent)] text-black flex items-center justify-center">
              <Zap size={18} />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              Velocity
            </span>
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Sign in to manage your bookings.
          </p>

          {authError && (
            <div className="mt-6 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-4 py-3 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-sm text-[var(--color-muted)] text-center">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden lg:block relative overflow-hidden bg-[var(--color-surface)]">
        <img
          src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400"
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)]/60 via-transparent to-[var(--color-bg)]" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="font-display text-4xl font-semibold tracking-tight text-white">
            Drive anything.
            <br />
            Anywhere. Anytime.
          </div>
          <p className="mt-3 text-white/70 max-w-md">
            Premium rentals with instant booking, transparent pricing, and full
            coverage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
