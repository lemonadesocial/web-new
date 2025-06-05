import { fetchAccount } from "@lens-protocol/client/actions";
import { notFound } from "next/navigation";

import { LensProfileCard } from "$lib/components/features/lens-account/LensProfileCard";
import { client } from "$lib/utils/lens/client";
import { LensFeed } from "$lib/components/features/lens-feed/LensFeed";
import { LEMONADE_FEED_ADDRESS } from "$lib/utils/constants";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const username = (await params).username;

  const result = await fetchAccount(client, {
    username: {
      localName: username,
    },
  });

  if (result.isErr() || !result.value) return notFound();

  console.log(LEMONADE_FEED_ADDRESS);

  return (
    <div className="md:grid md:grid-cols-[336px_1fr] gap-5 md:gap-8 items-start pb-10">
      <LensProfileCard account={result.value} />
      <LensFeed authorId={result.value.address} showReposts />
    </div>
  );
}
