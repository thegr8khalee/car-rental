import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useSellStore = create((set) => ({
    // State
    isSubmitting: false,
    error: null,
    successMessage: null,

    // Actions
    submitSellForm: async (formData) => {
        set({ isSubmitting: true, error: null, successMessage: null });
        try {
            const backendData = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                emailAddress: formData.email,
                carMake: formData.make,
                carModel: formData.model,
                yearOfManufacture: formData.year,
                mileageKm: formData.mileage,
                condition: formData.condition,
                uploadPhotos: formData.images,
                additionalNotes: formData.additionalNotes,
            };

            const res = await axiosInstance.post('/sell/submit', backendData);

            set({ successMessage: res.data.message, isSubmitting: false });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit the form.';
            const validationDetails = Array.isArray(error.response?.data?.errors)
                ? error.response.data.errors.join(' ')
                : '';
            const combinedMessage = validationDetails ? `${message} ${validationDetails}` : message;
            console.error('Sell form submission failed', error);
            toast.error(combinedMessage);
            set({ error: combinedMessage, isSubmitting: false });
            return false;
        }
    },
}));