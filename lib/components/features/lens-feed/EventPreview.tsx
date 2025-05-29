import { extractShortId } from "$lib/utils/event";

export function EventPreview({ url }: { url: string }) {
  return (
    <img
      src={`${process.env.NEXT_PUBLIC_HOST_URL}/api/og/event/${extractShortId(url)}`}
      alt="Post attachment"
      className="rounded-sm object-cover border border-card-border h-full w-full aspect-video cursor-pointer"
      onClick={() => window.open(url, '_blank')}
    />
  );
}
