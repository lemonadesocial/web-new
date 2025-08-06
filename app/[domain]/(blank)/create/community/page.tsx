import { CommunityForm } from '$lib/components/features/community/CommunityForm';
import Header from '$lib/components/layouts/header';

export default function Page() {
  return (
    <>
      <Header />

      <div className="w-full max-w-[984px] mx-auto px-4 md: px-0 flex flex-col gap-6 my-6">
        <h3 className="text-2xl md:text-3xl font-semibold">Create Community</h3>

        <CommunityForm />
      </div>
    </>
  );
}
