'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '$core/button';
import { InputField } from '$core/input';
import { Card, ModalContent } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import { match } from 'ts-pattern';

export function PasswordGate({ isExpired, error }: { error?: boolean; isExpired?: boolean }) {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [toggleViewPass, setToggleViewPass] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    document.cookie = `preview-pwd=${encodeURIComponent(password)}; path=/; SameSite=Lax`;

    router.refresh();
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex justify-center">
        <div className="mt-20">
          <Card.Root className="w-full max-w-sm md:max-w-md">
            <Card.Content className="p-0">
              <ModalContent icon="icon-lock">
                {match(isExpired)
                  .with(true, () => (
                    <div className="space-y-2">
                      <p className="text-lg">This Link has Expired</p>
                      <p className="text-secondary text-sm">
                        The preview link you're trying to access is no longer valid. Ask the owner to generate a new
                        one.
                      </p>
                    </div>
                  ))
                  .otherwise(() => (
                    <>
                      <div className="space-y-2">
                        <p className="text-lg">Password Protected</p>
                        <p className="text-secondary text-sm">Enter the password to preview this page.</p>
                      </div>
                      <form onSubmit={handleSubmit} className="w-full space-y-4 mt-4">
                        <InputField
                          label="Password"
                          type={toggleViewPass ? 'text' : 'password'}
                          placeholder="Enter password"
                          value={password}
                          error={!!error}
                          hint={error ? 'Incorrect password. Please try again.' : ''}
                          onChangeText={(value) => setPassword(value)}
                          right={{
                            icon: !toggleViewPass ? 'icon-eye-line size-4' : 'icon-eye-off-line size-4',
                            onClick: () => setToggleViewPass((prev) => !prev),
                          }}
                        />

                        <Button
                          type="submit"
                          variant="secondary"
                          className="w-full"
                          disabled={!password || submitting}
                          loading={submitting}
                        >
                          View Page
                        </Button>
                      </form>
                    </>
                  ))}
              </ModalContent>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </main>
  );
}
