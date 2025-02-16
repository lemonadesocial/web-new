'use client';
import { useRouter } from 'next/navigation';

import { Modal } from '$core/modal';
import { SignIn } from '$ui/auth';

export default function Page() {
  const router = useRouter();
  return (
    <Modal isOpen onClose={() => router.back()}>
      <SignIn />
    </Modal>
  );
}
