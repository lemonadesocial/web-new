import CommunityLayout from "$lib/components/layouts/community";


export default function Layout({ children, }: { children: React.ReactNode; }) {
  return (
    <CommunityLayout>
      {children}
    </CommunityLayout>
  );
}
