import { Content } from './content';

function Page() {
  return (
    <div className="flex justify-center h-[calc(100dvh-56px)]">
      <div className="w-full max-w-[720px]">
        <Content />
      </div>
    </div>
  );
}

export default Page;
