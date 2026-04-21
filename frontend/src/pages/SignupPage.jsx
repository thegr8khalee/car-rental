import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useUserAuthStore } from '../store/useUserAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading, authError } = useUserAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(formData);
    if (!result?.success) return;
    if (result.emailConfirmationRequired) navigate('/verify-email-sent');
    else navigate('/profile');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-lg bg-[var(--color-accent)] text-black flex items-center justify-center">
              <Zap size={18} />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              Velocity
            </span>
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Start booking in under a minute.
          </p>

          {authError && (
            <div className="mt-6 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-4 py-3 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Input
              label="Full name"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
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
              type="tel"
              label="Phone number"
              placeholder="+234..."
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="At least 8 characters"
              hint="Use 8+ chars with upper, lower, and a number."
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={8}
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
              Create account
            </Button>

            <p className="text-xs text-[var(--color-muted)] text-center">
              By signing up, you agree to our{' '}
              <Link to="/privacy" className="text-[var(--color-accent)]">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="mt-6 text-sm text-[var(--color-muted)] text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden bg-[var(--color-surface)]">
        <img
          src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1400"
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)]/60 via-transparent to-[var(--color-bg)]" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="font-display text-4xl font-semibold tracking-tight text-white">
            Join the drive.
          </div>
          <p className="mt-3 text-white/70 max-w-md">
            Instant bookings, transparent pricing, and premium fleet across
            every city.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
