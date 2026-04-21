import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

export const useBookingStore = create((set, get) => ({
  draft: {
    carId: null,
    car: null,
    startDate: null,
    endDate: null,
    pickupLocationId: null,
    returnLocationId: null,
    extras: [],
    renterName: '',
    renterPhone: '',
    renterLicense: '',
    licenseImageUrl: '',
    notes: '',
  },
  isSubmitting: false,
  myBookings: [],
  isLoadingMine: false,

  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  resetDraft: () =>
    set({
      draft: {
        carId: null,
        car: null,
        startDate: null,
        endDate: null,
        pickupLocationId: null,
        returnLocationId: null,
        extras: [],
        renterName: '',
        renterPhone: '',
        renterLicense: '',
        licenseImageUrl: '',
        notes: '',
      },
    }),

  toggleExtra: (extra) =>
    set((s) => {
      const exists = s.draft.extras.find((e) => e.id === extra.id);
      const extras = exists
        ? s.draft.extras.filter((e) => e.id !== extra.id)
        : [...s.draft.extras, extra];
      return { draft: { ...s.draft, extras } };
    }),

  createBooking: async () => {
    const { draft } = get();
    set({ isSubmitting: true });
    try {
      const payload = {
        carId: draft.carId,
        startDate: draft.startDate,
        endDate: draft.endDate,
        pickupLocationId: draft.pickupLocationId,
        returnLocationId: draft.returnLocationId,
        extras: draft.extras,
        renterName: draft.renterName,
        renterPhone: draft.renterPhone,
        renterLicense: draft.renterLicense,
        licenseImageUrl: draft.licenseImageUrl,
        notes: draft.notes,
      };
      const res = await axiosInstance.post('/bookings', payload);
      toast.success('Booking reserved!');
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to create booking.';
      toast.error(msg);
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchMyBookings: async () => {
    set({ isLoadingMine: true });
    try {
      const res = await axiosInstance.get('/bookings/mine');
      set({ myBookings: res.data });
    } catch (err) {
      console.error('fetchMyBookings', err);
    } finally {
      set({ isLoadingMine: false });
    }
  },

  cancelBooking: async (id) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/cancel`);
      set((s) => ({
        myBookings: s.myBookings.map((b) =>
          b.id === id ? { ...b, status: 'cancelled' } : b
        ),
      }));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  },
}));
