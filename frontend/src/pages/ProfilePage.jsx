import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  LogOut,
  Mail,
  Phone,
  User as UserIcon,
  Car as CarIcon,
} from 'lucide-react';
import { useUserAuthStore } from '../store/useUserAuthStore';
import { useBookingStore } from '../store/useBookingStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { StatusBadge } from '../components/ui/Badge';
import { formatPrice } from '../components/ui/PriceDisplay';

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

function BookingCard({ booking, onCancel }) {
  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="sm:w-40 aspect-[16/10] rounded-lg overflow-hidden bg-[var(--color-elevated)] flex-shrink-0">
          {booking.car?.imageUrls?.[0] && (
            <img
              src={booking.car.imageUrls[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
                {booking.car?.make} · {booking.reference}
              </div>
              <div className="font-semibold text-[var(--color-text)]">
                {booking.car?.model}
              </div>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <div className="mt-3 text-sm text-[var(--color-muted)] space-y-1">
            <div className="inline-flex items-center gap-2">
              <Calendar size={13} />
              {fmtDate(booking.startDate)} → {fmtDate(booking.endDate)}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="font-semibold">{formatPrice(booking.total)}</div>
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(booking.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useUserAuthStore();
  const { myBookings, fetchMyBookings, cancelBooking, isLoadingMine } =
    useBookingStore();

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    fetchMyBookings();
  }, [authUser, navigate, fetchMyBookings]);

  const grouped = useMemo(() => {
    const upcoming = [];
    const past = [];
    const cancelled = [];
    (myBookings || []).forEach((b) => {
      if (b.status === 'cancelled') cancelled.push(b);
      else if (b.status === 'completed') past.push(b);
      else upcoming.push(b);
    });
    return { upcoming, past, cancelled };
  }, [myBookings]);

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Hello, {authUser.username || 'friend'}
            </h1>
            <p className="mt-1 text-[var(--color-muted)]">
              Manage your bookings and account
            </p>
          </div>
          <Button
            variant="ghost"
            leftIcon={<LogOut size={14} />}
            onClick={() => {
              logout?.();
              navigate('/');
            }}
          >
            Sign out
          </Button>
        </div>

        <Tabs defaultValue="bookings">
          <TabsList>
            <TabsTrigger value="bookings">My bookings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {isLoadingMine ? (
              <Card className="p-8 text-center text-[var(--color-muted)]">
                Loading…
              </Card>
            ) : (myBookings || []).length === 0 ? (
              <Card className="p-12 text-center">
                <CarIcon
                  size={24}
                  className="mx-auto mb-3 text-[var(--color-muted)]"
                />
                <div className="text-[var(--color-muted)]">
                  You haven't booked anything yet.
                </div>
                <Link to="/listings" className="mt-4 inline-block">
                  <Button>Browse fleet</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-8">
                {grouped.upcoming.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                      Upcoming ({grouped.upcoming.length})
                    </h2>
                    <div className="space-y-3">
                      {grouped.upcoming.map((b) => (
                        <BookingCard
                          key={b.id}
                          booking={b}
                          onCancel={cancelBooking}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {grouped.past.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                      Past ({grouped.past.length})
                    </h2>
                    <div className="space-y-3">
                      {grouped.past.map((b) => (
                        <BookingCard
                          key={b.id}
                          booking={b}
                          onCancel={cancelBooking}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {grouped.cancelled.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                      Cancelled ({grouped.cancelled.length})
                    </h2>
                    <div className="space-y-3">
                      {grouped.cancelled.map((b) => (
                        <BookingCard
                          key={b.id}
                          booking={b}
                          onCancel={cancelBooking}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="account">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] flex items-center justify-center text-xl font-semibold">
                  {(authUser.username || authUser.email || 'U')
                    .slice(0, 1)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {authUser.username || '—'}
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">
                    Member since{' '}
                    {authUser.createdAt
                      ? new Date(authUser.createdAt).getFullYear()
                      : '—'}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-[var(--color-elevated)] p-4">
                  <div className="inline-flex items-center gap-2 text-[var(--color-muted)] text-xs mb-1">
                    <Mail size={13} /> Email
                  </div>
                  <div>{authUser.email || '—'}</div>
                </div>
                <div className="rounded-lg bg-[var(--color-elevated)] p-4">
                  <div className="inline-flex items-center gap-2 text-[var(--color-muted)] text-xs mb-1">
                    <Phone size={13} /> Phone
                  </div>
                  <div>{authUser.phoneNumber || '—'}</div>
                </div>
                <div className="rounded-lg bg-[var(--color-elevated)] p-4">
                  <div className="inline-flex items-center gap-2 text-[var(--color-muted)] text-xs mb-1">
                    <UserIcon size={13} /> Username
                  </div>
                  <div>{authUser.username || '—'}</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
