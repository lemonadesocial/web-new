import Header from "$lib/components/layouts/header";

export default function EventLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="relative flex flex-col h-dvh w-full z-100 overflow-auto">
      <Header />
      <div className="page mx-auto px-4 xl:px-0">{children}</div>
    </main>
  );
}
