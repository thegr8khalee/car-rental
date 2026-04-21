import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const EmailVerificationSentPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] flex items-center justify-center">
          <Mail className="w-7 h-7" />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight mb-3">
          Check your email
        </h1>
        <p className="text-[var(--color-muted)] mb-8">
          We sent a confirmation link to your inbox. Click it to verify your
          account and finish signing in.
        </p>
        <div className="space-y-3">
          <Link to="/login" className="block">
            <Button className="w-full">Go to sign in</Button>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerificationSentPage;
