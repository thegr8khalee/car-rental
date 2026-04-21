import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  MapPin,
  Shield,
  User,
} from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';
import { useUserAuthStore } from '../../store/useUserAuthStore';
import { axiosInstance } from '../../lib/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { formatPrice } from '../../components/ui/PriceDisplay';

const STEPS = [
  { id: 1, label: 'Dates & Location', icon: <Calendar size={14} /> },
  { id: 2, label: 'Extras', icon: <Shield size={14} /> },
  { id: 3, label: 'Details', icon: <User size={14} /> },
  { id: 4, label: 'Payment', icon: <CreditCard size={14} /> },
  { id: 5, label: 'Confirmed', icon: <CheckCircle2 size={14} /> },
];

const EXTRAS = [
  {
    id: 'insurance_standard',
    name: 'Standard insurance',
    description: '$2,000 deductible. Included.',
    price: 0,
    included: true,
  },
  {
    id: 'insurance_premium',
    name: 'Premium insurance',
    description: 'Zero deductible, full coverage.',
    price: 18,
  },
  {
    id: 'gps',
    name: 'GPS navigation',
    description: 'Turn-by-turn with traffic.',
    price: 8,
  },
  {
    id: 'child_seat',
    name: 'Child seat',
    description: 'Ages 1–6, rear-facing or forward.',
    price: 6,
  },
  {
    id: 'additional_driver',
    name: 'Additional driver',
    description: 'Add a second licensed driver.',
    price: 10,
  },
];

function daysBetween(a, b) {
  if (!a || !b) return 0;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function Stepper({ current }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <React.Fragment key={s.id}>
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-colors ${
                done
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30'
                  : active
                  ? 'bg-[var(--color-accent)] text-[#04121a] border-transparent'
                  : 'bg-[var(--color-elevated)] text-[var(--color-muted)] border-[var(--color-border-subtle)]'
              }`}
            >
              {done ? <Check size={12} /> : s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px w-4 bg-[var(--color-border-subtle)]" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const BookingFlow = () => {
  const navigate = useNavigate();
  const { authUser } = useUserAuthStore();
  const { draft, setDraft, toggleExtra, createBooking, isSubmitting, resetDraft } =
    useBookingStore();
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState([]);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/locations?active=true')
      .then((r) => {
        setLocations(r.data);
        setDraft({
          pickupLocationId: draft.pickupLocationId || r.data[0]?.id,
          returnLocationId: draft.returnLocationId || r.data[0]?.id,
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draft.carId) navigate('/listings');
  }, [draft.carId, navigate]);

  const days = daysBetween(draft.startDate, draft.endDate);
  const daily = Number(draft.car?.dailyRate || 0);
  const subtotal = +(daily * days).toFixed(2);
  const extrasTotal = draft.extras.reduce(
    (sum, e) => sum + Number(e.price || 0) * days,
    0
  );
  const fees = +(subtotal * 0.1).toFixed(2);
  const deposit = Number(draft.car?.depositAmount || 0);
  const total = +(subtotal + extrasTotal + fees + deposit).toFixed(2);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handlePay = async () => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    const booking = await createBooking();
    if (booking) {
      setConfirmed(booking);
      setStep(5);
      resetDraft();
    }
  };

  if (!draft.car && step < 5) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to={draft.carId ? `/car/${draft.carId}` : '/listings'}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] mb-6"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
          Complete your booking
        </h1>
        <Stepper current={step} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {step === 1 && (
              <Card className="p-6 space-y-5">
                <h2 className="text-lg font-semibold">Dates & location</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Pickup date"
                    value={draft.startDate || ''}
                    onChange={(e) => setDraft({ startDate: e.target.value })}
                  />
                  <Input
                    type="date"
                    label="Return date"
                    value={draft.endDate || ''}
                    min={draft.startDate}
                    onChange={(e) => setDraft({ endDate: e.target.value })}
                  />
                </div>
                <Select
                  label="Pickup location"
                  value={draft.pickupLocationId || ''}
                  onChange={(e) =>
                    setDraft({ pickupLocationId: e.target.value })
                  }
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.city}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Return location"
                  value={draft.returnLocationId || ''}
                  onChange={(e) =>
                    setDraft({ returnLocationId: e.target.value })
                  }
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.city}
                    </option>
                  ))}
                </Select>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Extras & protection</h2>
                <div className="space-y-2">
                  {EXTRAS.map((x) => {
                    const active = draft.extras.some((e) => e.id === x.id);
                    return (
                      <button
                        type="button"
                        key={x.id}
                        onClick={() => !x.included && toggleExtra(x)}
                        className={`w-full text-left p-4 rounded-xl border transition-colors ${
                          x.included
                            ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 cursor-default'
                            : active
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                            : 'border-[var(--color-border-subtle)] bg-[var(--color-elevated)] hover:border-[var(--color-accent)]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium text-[var(--color-text)]">
                              {x.name}
                            </div>
                            <div className="text-xs text-[var(--color-muted)] mt-0.5">
                              {x.description}
                            </div>
                          </div>
                          <div className="text-sm text-[var(--color-text)] whitespace-nowrap">
                            {x.included
                              ? 'Included'
                              : `${formatPrice(x.price)}/day`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {step === 3 && (
              <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Renter details</h2>
                <Input
                  label="Full name"
                  placeholder="Jane Doe"
                  value={draft.renterName}
                  onChange={(e) => setDraft({ renterName: e.target.value })}
                />
                <Input
                  label="Phone"
                  placeholder="+1 234 567 8900"
                  value={draft.renterPhone}
                  onChange={(e) => setDraft({ renterPhone: e.target.value })}
                />
                <Input
                  label="Driver's license number"
                  value={draft.renterLicense}
                  onChange={(e) => setDraft({ renterLicense: e.target.value })}
                />
                <Input
                  label="License image URL (optional)"
                  placeholder="Upload elsewhere and paste URL here"
                  value={draft.licenseImageUrl}
                  onChange={(e) => setDraft({ licenseImageUrl: e.target.value })}
                />
                <Input
                  label="Notes (optional)"
                  value={draft.notes}
                  onChange={(e) => setDraft({ notes: e.target.value })}
                />
              </Card>
            )}

            {step === 4 && (
              <Card className="p-6 space-y-5">
                <h2 className="text-lg font-semibold">Payment</h2>
                <p className="text-sm text-[var(--color-muted)]">
                  Card processing is stubbed in this demo — clicking "Reserve"
                  creates a pending booking you can pay later.
                </p>
                <Input label="Name on card" placeholder="Jane Doe" />
                <Input label="Card number" placeholder="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Expiry" placeholder="MM/YY" />
                  <Input label="CVC" placeholder="123" />
                </div>
                <div className="rounded-xl bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] p-4 text-sm text-[var(--color-muted)]">
                  You'll be charged {formatPrice(total)} when your booking is
                  confirmed. Cancel free up to 24 hours before pickup.
                </div>
              </Card>
            )}

            {step === 5 && confirmed && (
              <Card className="p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] flex items-center justify-center mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="text-2xl font-semibold">Booking confirmed</h2>
                <p className="mt-2 text-[var(--color-muted)]">
                  Your reference is{' '}
                  <span className="text-[var(--color-accent)] font-mono">
                    {confirmed.reference}
                  </span>
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
                  <div className="rounded-lg bg-[var(--color-elevated)] p-3">
                    <div className="text-[var(--color-muted)] text-xs">
                      Pickup
                    </div>
                    <div>{confirmed.startDate}</div>
                  </div>
                  <div className="rounded-lg bg-[var(--color-elevated)] p-3">
                    <div className="text-[var(--color-muted)] text-xs">
                      Return
                    </div>
                    <div>{confirmed.endDate}</div>
                  </div>
                  <div className="rounded-lg bg-[var(--color-elevated)] p-3 col-span-2">
                    <div className="text-[var(--color-muted)] text-xs">
                      Total
                    </div>
                    <div className="text-[var(--color-text)] text-lg font-semibold">
                      {formatPrice(confirmed.total)}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3 justify-center">
                  <Button onClick={() => navigate('/profile')}>
                    See my bookings
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/listings')}>
                    Book another
                  </Button>
                </div>
              </Card>
            )}

            {step < 5 && (
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={back}
                  disabled={step === 1}
                  leftIcon={<ArrowLeft size={14} />}
                >
                  Back
                </Button>
                {step < 4 ? (
                  <Button onClick={next} rightIcon={<ArrowRight size={14} />}>
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handlePay} loading={isSubmitting}>
                    Reserve · {formatPrice(total)}
                  </Button>
                )}
              </div>
            )}
          </motion.div>

          {/* Sidebar summary */}
          {step < 5 && (
            <aside>
              <Card className="p-5 sticky top-24">
                {draft.car && (
                  <div className="mb-4">
                    <div className="rounded-xl overflow-hidden bg-[var(--color-elevated)] aspect-[16/10]">
                      {draft.car.imageUrls?.[0] && (
                        <img
                          src={draft.car.imageUrls[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
                        {draft.car.make} · {draft.car.year}
                      </div>
                      <div className="font-semibold">{draft.car.model}</div>
                    </div>
                  </div>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>
                      {formatPrice(daily)} × {days} day{days !== 1 && 's'}
                    </span>
                    <span className="text-[var(--color-text)]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {extrasTotal > 0 && (
                    <div className="flex justify-between text-[var(--color-muted)]">
                      <span>Extras</span>
                      <span className="text-[var(--color-text)]">
                        {formatPrice(extrasTotal)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>Service fee</span>
                    <span className="text-[var(--color-text)]">
                      {formatPrice(fees)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>Deposit</span>
                    <span className="text-[var(--color-text)]">
                      {formatPrice(deposit)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--color-border-subtle)] font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
