import React from 'react';
import branding from '../config/branding';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Shield, Zap, Heart, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const About = () => {
  const companyName = branding.company.name;
  const legalName = branding.company.legalName;
  const tagline = branding.company.tagline;
  const ceoName = branding.company.ceo?.name ?? 'Our CEO';
  const ceoBio = branding.company.ceo?.bio ?? '';
  const contactInfo = branding.contact ?? {};
  const address = contactInfo.address ?? {};
  const addressText =
    address.formatted ||
    [address.line1, address.line2, address.city, address.region, address.country]
      .filter(Boolean)
      .join(', ');

  const values = [
    {
      icon: <Zap className="w-6 h-6 text-[var(--color-accent)]" />,
      title: 'No counters, no waiting',
      description:
        'Unlock the car from your phone. The only paperwork is your license — scanned once.',
    },
    {
      icon: <Shield className="w-6 h-6 text-[var(--color-accent)]" />,
      title: 'Fully covered, every mile',
      description:
        'Comprehensive insurance and 24/7 roadside assistance included with every booking.',
    },
    {
      icon: <Heart className="w-6 h-6 text-[var(--color-accent)]" />,
      title: 'Clean, pristine, always',
      description:
        'Every car is detailed and safety-checked between rentals. You get it the way you want it returned.',
    },
    {
      icon: <Award className="w-6 h-6 text-[var(--color-accent)]" />,
      title: 'A curated garage',
      description:
        'We don\'t stock what we wouldn\'t drive. Luxury, sport, EV, SUV — picked for how they feel on the road.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-5">
            About {companyName}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight">
            Rental, <span className="text-[var(--color-accent)]">reimagined</span>.
          </h1>
          <p className="mt-5 text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            {tagline}
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="font-display text-3xl font-semibold tracking-tight mb-6">
            Our story
          </h2>
          <div className="space-y-4 text-[var(--color-muted)] leading-relaxed">
            <p>
              {companyName} started with a simple frustration: getting a good car
              for a few days felt like filing taxes. Forms. Counters. "Sign here,
              initial there." By the time you got the keys, the trip was half
              over.
            </p>
            <p>
              So we built the opposite. {legalName} is a premium rental service
              where you pick a car, pick your dates, and the car unlocks when you
              arrive. That's it.
            </p>
            <p>
              Every vehicle in the fleet is hand-chosen, maintained to
              manufacturer spec, and ready for whatever the road asks of it —
              airport runs, weekends away, a client meeting where the car has
              to say something on its own.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2
          className="font-display text-3xl font-semibold tracking-tight mb-8 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          What we stand for
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="p-6 h-full">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)]">
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {ceoBio && (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6">
              Leadership
            </h2>
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-1">
                {ceoName}
              </h3>
              <p className="text-sm text-[var(--color-accent)] font-medium mb-4">
                Chief Executive Officer
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                {ceoBio}
              </p>
            </Card>
          </motion.div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        <motion.h2
          className="font-display text-3xl font-semibold tracking-tight mb-8 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Get in touch
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {addressText && (
            <Card className="p-6">
              <MapPin className="w-5 h-5 text-[var(--color-accent)] mb-3" />
              <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Visit
              </div>
              <div className="text-sm">{addressText}</div>
            </Card>
          )}
          {contactInfo.phones?.main && (
            <Card className="p-6">
              <Phone className="w-5 h-5 text-[var(--color-accent)] mb-3" />
              <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Call
              </div>
              <a
                href={`tel:${contactInfo.phones.main.value}`}
                className="text-sm hover:text-[var(--color-accent)] transition-colors"
              >
                {contactInfo.phones.main.display}
              </a>
            </Card>
          )}
          {contactInfo.emails?.info && (
            <Card className="p-6">
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
        </div>
      </section>
    </div>
  );
};

export default About;
