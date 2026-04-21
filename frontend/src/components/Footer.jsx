import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)] mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)] text-[#04121a]">
                <Zap size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-semibold text-[var(--color-text)]">
                Velocity
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted)] max-w-sm">
              Drive anything. Anywhere. Anytime. Premium cars on demand — no
              counters, no paperwork, no waiting.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-colors"
                  aria-label="Social"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Fleet
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/makes" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Makes
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-[var(--color-text)]">
              <li>24/7 roadside assist</li>
              <li>hello@velocity.rent</li>
              <li>+1 (234) 567-89</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} Velocity Rentals Ltd. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Crafted for drivers who refuse to compromise.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
