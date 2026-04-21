import React from 'react';
import branding from '../config/branding';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Section = ({ title, children }) => (
  <motion.div
    className="mb-8"
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    <div className="space-y-3 text-[var(--color-muted)] leading-relaxed text-sm">
      {children}
    </div>
  </motion.div>
);

const PrivacyPolicy = () => {
  const companyName = branding.company.name;
  const legalName = branding.company.legalName;
  const contactEmail = branding.contact?.emails?.info ?? 'info@example.com';

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-10 text-center">
        <motion.h1
          className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-3"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          className="text-[var(--color-muted)] text-sm"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Last updated: January 1, 2026
        </motion.p>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-[var(--color-muted)] leading-relaxed mb-10 text-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            At {legalName} (&ldquo;{companyName}&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;, or &ldquo;our&rdquo;), your privacy matters. This
            Privacy Policy explains how we collect, use, and protect your
            information when you use our website and services.
          </motion.p>

          <Section title="1. Information We Collect">
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone
                number, and other details you provide when contacting us, creating
                an account, or submitting a vehicle listing.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent on the site,
                browser type, device information, and other analytics data collected
                automatically.
              </li>
              <li>
                <strong>Cookies:</strong> Small data files stored on your device to
                improve your browsing experience. You can manage cookie preferences
                in your browser settings.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Provide, operate, and maintain our website and services</li>
              <li>Respond to your inquiries and communicate with you</li>
              <li>Process vehicle listings and sale submissions</li>
              <li>Send newsletters and promotional content (with your consent)</li>
              <li>Improve our website, user experience, and service offerings</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
            </ul>
          </Section>

          <Section title="3. Information Sharing">
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Service Providers:</strong> Trusted third-party services
                that help us operate our website (e.g., hosting, analytics, email
                delivery).
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                respond to legal process.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger,
                acquisition, or sale of assets.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <p>
              We implement reasonable security measures to protect your personal
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p>
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to or restrict certain processing activities</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary hover:underline"
              >
                {contactEmail}
              </a>
              .
            </p>
          </Section>

          <Section title="6. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those sites. We
              encourage you to review the privacy policies of any third-party
              websites you visit.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              Our services are not directed to individuals under the age of 18. We
              do not knowingly collect personal information from children. If you
              believe we have inadvertently collected such information, please
              contact us so we can promptly remove it.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes will
              be posted on this page with an updated &ldquo;Last updated&rdquo;
              date. Your continued use of our website after changes are posted
              constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please contact us
              at:
            </p>
            <p>
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary hover:underline"
              >
                {contactEmail}
              </a>
            </p>
          </Section>

          {/* Demo Disclaimer */}
          <div className="mt-12 p-4 bg-base-200 rounded-lg">
            <p className="text-xs text-base-content/50 text-center">
              This privacy policy is for demonstration purposes only. It does not
              constitute legal advice. If you are deploying this template for a real
              business, consult a qualified legal professional to draft a privacy
              policy that complies with applicable laws and regulations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
