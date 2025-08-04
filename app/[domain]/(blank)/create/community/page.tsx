import { CommunityForm } from '$lib/components/features/community/CommunityForm';
import Header from '$lib/components/layouts/header';

export default function Page() {
  return (
    <>
      <Header />

      <div className="w-[984px] mx-auto flex flex-col gap-6 my-6">
        <h3 className="text-3xl font-semibold">Create Community</h3>

        <CommunityForm />
      </div>
    </>
  );
}
