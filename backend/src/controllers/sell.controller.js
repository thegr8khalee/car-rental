import SellNow from "../models/sell.model.js";
import cloudinary from '../lib/cloudinary.js'; // ADD THIS LINE

export const submitSellForm = async (req, res) => {
    try {
        const {
            fullName,
            phoneNumber,
            emailAddress,
            carMake,
            carModel,
            yearOfManufacture,
            mileageKm,
            condition,
            uploadPhotos,
            additionalNotes,
        } = req.body;

        if (!fullName || !phoneNumber || !emailAddress || !carMake || !carModel || !yearOfManufacture || !mileageKm || !condition) {
            return res.status(400).json({
                success: false,
                message: 'Missing essential required fields for car submission.',
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address.',
            });
        }

        const phoneDigits = String(phoneNumber).replace(/[^\d]/g, '');
        if (phoneDigits.length < 7 || phoneDigits.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number.',
            });
        }

        const year = Number(yearOfManufacture);
        const currentYear = new Date().getFullYear();
        if (!Number.isFinite(year) || year < 1900 || year > currentYear + 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year of manufacture.',
            });
        }

        const mileage = Number(mileageKm);
        if (!Number.isFinite(mileage) || mileage < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid mileage.',
            });
        }

        let imageUrls = [];
        if (uploadPhotos && Array.isArray(uploadPhotos) && uploadPhotos.length > 0) {
            const uploadedImages = await uploadImagesToCloudinary(uploadPhotos);
            imageUrls = uploadedImages.map((img) => img.url);
        }

        const sellData = {
            fullName,
            phoneNumber,
            emailAddress,
            carMake,
            carModel,
            yearOfManufacture: Number(yearOfManufacture),
            mileageKm: Number(mileageKm),
            condition,
            uploadPhotos: imageUrls,
            additionalNotes: additionalNotes || null,
        };

        const newSubmission = await SellNow.create(sellData);

        return res.status(201).json({
            success: true,
            message: 'Your car submission has been received successfully and photos uploaded!',
            data: {
                id: newSubmission.id,
                email: newSubmission.emailAddress,
                make: newSubmission.carMake,
                model: newSubmission.carModel,
                condition: newSubmission.condition,
                photoCount: imageUrls.length,
            },
        });

    } catch (error) {
        console.error('Error submitting sell form:', error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Data validation failed.',
                errors: messages,
            });
        }

        const errorMessage = error.message || 'An internal server error occurred.';
        return res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};

const uploadImagesToCloudinary = async (base64Images) => {
    if (!base64Images || base64Images.length === 0) {
        return [];
    }

    const uploadPromises = base64Images.map((base64Image) => {
        return cloudinary.uploader.upload(base64Image, {
            folder: 'car-dealership/sell-submissions',
        });
    });

    try {
        const results = await Promise.all(uploadPromises);
        return results.map((result) => ({
            url: result.secure_url,
            public_id: result.public_id,
        }));
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload images to Cloudinary.');
    }
};