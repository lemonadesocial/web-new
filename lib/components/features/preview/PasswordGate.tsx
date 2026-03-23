'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '$core/button';
import { InputField } from '$core/input';

export function PasswordGate({ token, error }: { token: string; error?: boolean }) {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Set cookie scoped to root path so it's sent for all requests on this domain
    document.cookie = `preview-pwd=${encodeURIComponent(password)}; path=/; SameSite=Lax`;

    // Trigger SSR re-render
    router.refresh();

    // Reset submitting after a short delay to allow SSR to complete
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-xl font-semibold text-primary">This preview is password protected</h1>

        {error && <p className="text-center text-sm text-danger">Incorrect password. Please try again.</p>}

        <InputField
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChangeText={(value) => setPassword(value)}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={!password || submitting}
          loading={submitting}
        >
          Continue
        </Button>
      </form>
    </main>
  );
}
