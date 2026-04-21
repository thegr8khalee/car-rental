import React, { useState } from 'react';
import branding from '../config/branding';
import { motion } from 'framer-motion';
import { Loader2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const contactInfo = branding.contact ?? {};
  const getPhoneDetails = (phone) => ({
    display: phone?.display || phone?.value || '',
    value: phone?.value || phone?.display || '',
  });
  const mainPhone = getPhoneDetails(contactInfo.phones?.main);
  const supportPhone = getPhoneDetails(contactInfo.phones?.support);

  const address = contactInfo.address ?? {};
  const addressText =
    address.formatted ||
    [address.line1, address.line2, address.city, address.region, address.country]
      .filter(Boolean)
      .join(', ');

  const fallbackLocation = { latitude: 9.0533, longitude: 7.4753 };
  const location = {
    latitude:
      typeof contactInfo.location?.latitude === 'number'
        ? contactInfo.location.latitude
        : fallbackLocation.latitude,
    longitude:
      typeof contactInfo.location?.longitude === 'number'
        ? contactInfo.location.longitude
        : fallbackLocation.longitude,
  };
  const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  const googleMapsEmbedUrl =
    googleMapsApiKey
      ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${location.latitude},${location.longitude}&center=${location.latitude},${location.longitude}&zoom=15`
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSuccessMessage("Thanks for reaching out. We'll get back to you shortly.");
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-4">
            Contact
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            We're listening.
          </h1>
          <p className="mt-3 text-[var(--color-muted)] text-lg max-w-xl">
            Questions about the fleet, a booking, or a special request — reach
            out and we'll be back to you within a business day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {contactInfo.emails?.info && (
              <Card className="p-5">
                <Mail className="w-5 h-5 text-[var(--color-accent)] mb-3" />
                <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                  Email
                </div>
                <a
                  href={`mailto:${contactInfo.emails.info}`}
                  className="text-sm hover:text-[var(--color-accent)] transition-colors break-all"
                >
                  {contactInfo.emails.info}
                </a>
              </Card>
            )}
            {mainPhone.display && (
              <Card className="p-5">
                <Phone className="w-5 h-5 text-[var(--color-accent)] mb-3" />
                <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                  Phone
                </div>
                <a
                  href={`tel:${mainPhone.value}`}
                  className="text-sm hover:text-[var(--color-accent)] transition-colors"
                >
                  {mainPhone.display}
                </a>
              </Card>
            )}
            {addressText && (
              <Card className="p-5">
                <MapPin className="w-5 h-5 text-[var(--color-accent)] mb-3" />
                <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                  Address
                </div>
                <div className="text-sm">{addressText}</div>
              </Card>
            )}
            {contactInfo.hours?.length > 0 && (
              <Card className="p-5">
                <Clock className="w-5 h-5 text-[var(--color-accent)] mb-3" />
                <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-2">
                  Hours
                </div>
                <ul className="space-y-1 text-sm">
                  {contactInfo.hours.map((entry) => (
                    <li key={`${entry.label}-${entry.value}`} className="flex justify-between gap-4">
                      <span className="text-[var(--color-muted)]">{entry.label}</span>
                      <span>{entry.value}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight mb-2">
                Send a message
              </h2>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                We read every note. Expect a reply within one business day.
              </p>

              {errorMessage && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm border border-[var(--color-danger)]/20">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm border border-[var(--color-accent)]/20">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-colors"
                    placeholder="What's on your mind?"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting} loading={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send message'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        {googleMapsEmbedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <Card className="overflow-hidden">
              <div className="w-full h-80">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our location"
                />
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contact;
