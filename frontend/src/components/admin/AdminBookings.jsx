import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Calendar, User, Car as CarIcon } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { StatusBadge } from '../ui/Badge';
import { formatPrice } from '../ui/PriceDisplay';

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'active',
  'completed',
  'cancelled',
];

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ status: '', q: '' });
  const [selected, setSelected] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.q) params.q = filter.q;
      const res = await axiosInstance.get('/bookings/admin/list', { params });
      setBookings(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [filter.status]);

  const onUpdateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/bookings/admin/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Bookings</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Manage reservations and rental lifecycle.
          </p>
        </div>
        <div className="flex items-end gap-2">
          <Select
            label="Status"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchList();
            }}
            className="flex items-end gap-2"
          >
            <Input
              label="Search"
              placeholder="Reference, name, email"
              value={filter.q}
              onChange={(e) => setFilter({ ...filter, q: e.target.value })}
              leftIcon={<Search size={14} />}
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-elevated)] text-[var(--color-muted)] text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-3">Reference</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Car</th>
                <th className="text-left p-3">Dates</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-[var(--color-muted)]"
                  >
                    Loading…
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-[var(--color-muted)]"
                  >
                    No bookings.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-[var(--color-elevated)]/60 cursor-pointer"
                    onClick={() => setSelected(b)}
                  >
                    <td className="p-3 font-mono text-xs">{b.reference}</td>
                    <td className="p-3">
                      <div className="font-medium">{b.renterName || '—'}</div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {b.user?.email}
                      </div>
                    </td>
                    <td className="p-3">
                      {b.car?.make} {b.car?.model}
                    </td>
                    <td className="p-3 text-xs">
                      {fmtDate(b.startDate)} → {fmtDate(b.endDate)}
                    </td>
                    <td className="p-3 font-medium">{formatPrice(b.total)}</td>
                    <td className="p-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(b);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative h-full w-full max-w-lg bg-[var(--color-surface)] border-l border-[var(--color-border-subtle)] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
                  Booking
                </div>
                <div className="font-mono text-lg">{selected.reference}</div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--color-muted)]">
                <User size={14} />
                <span>
                  {selected.renterName || selected.user?.username} ·{' '}
                  {selected.user?.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-muted)]">
                <CarIcon size={14} />
                <span>
                  {selected.car?.make} {selected.car?.model} ({selected.car?.year})
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-muted)]">
                <Calendar size={14} />
                <span>
                  {fmtDate(selected.startDate)} → {fmtDate(selected.endDate)}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-[var(--color-elevated)] p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Subtotal</span>
                <span>{formatPrice(selected.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Extras</span>
                <span>{formatPrice(selected.extrasTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Fees</span>
                <span>{formatPrice(selected.fees)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Deposit</span>
                <span>{formatPrice(selected.deposit)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-[var(--color-border-subtle)]">
                <span>Total</span>
                <span>{formatPrice(selected.total)}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
                Update status
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selected.status === s ? 'primary' : 'outline'}
                    onClick={() => onUpdateStatus(selected.id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              className="mt-8"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
