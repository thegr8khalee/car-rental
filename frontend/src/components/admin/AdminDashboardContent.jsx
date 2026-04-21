import React, { useEffect, useState } from 'react';
import {
  Activity,
  CalendarCheck,
  Car as CarIcon,
  DollarSign,
  Clock,
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { Card } from '../ui/Card';
import { formatPrice } from '../ui/PriceDisplay';
import { StatusBadge } from '../ui/Badge';

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : '—';

const Kpi = ({ icon: Icon, label, value, hint }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
          {label}
        </div>
        <div className="mt-1 text-2xl font-display font-semibold">{value}</div>
        {hint && (
          <div className="mt-1 text-xs text-[var(--color-muted)]">{hint}</div>
        )}
      </div>
      <div className="h-10 w-10 rounded-lg bg-[var(--color-accent)]/12 text-[var(--color-accent)] flex items-center justify-center">
        <Icon size={18} />
      </div>
    </div>
  </Card>
);

const AdminDashboardContent = ({ setActiveSection }) => {
  const [metrics, setMetrics] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [m, u] = await Promise.all([
          axiosInstance.get('/bookings/admin/metrics'),
          axiosInstance.get('/bookings/admin/list', {
            params: { status: 'confirmed' },
          }),
        ]);
        setMetrics(m.data);
        setUpcoming(u.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Overview</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Rental performance at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          icon={Activity}
          label="Active rentals"
          value={loading ? '—' : metrics?.activeRentals ?? 0}
          hint="Currently on the road"
        />
        <Kpi
          icon={CalendarCheck}
          label="Bookings this month"
          value={loading ? '—' : metrics?.bookingsThisMonth ?? 0}
        />
        <Kpi
          icon={DollarSign}
          label="Revenue this month"
          value={loading ? '—' : formatPrice(metrics?.revenueThisMonth || 0)}
        />
        <Kpi
          icon={Clock}
          label="Upcoming pickups"
          value={loading ? '—' : metrics?.upcomingPickups ?? 0}
          hint="Next 7 days"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-subtle)]">
          <div>
            <div className="font-display text-lg font-semibold">
              Next pickups
            </div>
            <div className="text-xs text-[var(--color-muted)]">
              Confirmed bookings on deck
            </div>
          </div>
          <button
            className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            onClick={() => setActiveSection?.('Bookings')}
          >
            View all →
          </button>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {loading ? (
            <div className="p-8 text-center text-[var(--color-muted)]">
              Loading…
            </div>
          ) : upcoming.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-muted)]">
              <CarIcon size={20} className="mx-auto mb-2" />
              No upcoming pickups.
            </div>
          ) : (
            upcoming.map((b) => (
              <div
                key={b.id}
                className="p-4 flex items-center gap-4 hover:bg-[var(--color-elevated)]/60"
              >
                <div className="h-12 w-16 rounded-md bg-[var(--color-elevated)] overflow-hidden flex-shrink-0">
                  {b.car?.imageUrls?.[0] && (
                    <img
                      src={b.car.imageUrls[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {b.car?.make} {b.car?.model}
                  </div>
                  <div className="text-xs text-[var(--color-muted)]">
                    {b.reference} · {b.renterName || b.user?.username}
                  </div>
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  {fmtDate(b.startDate)} → {fmtDate(b.endDate)}
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardContent;
