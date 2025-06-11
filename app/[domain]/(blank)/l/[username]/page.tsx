import { fetchAccount } from "@lens-protocol/client/actions";
import { notFound } from "next/navigation";

import { LensProfileCard } from "$lib/components/features/lens-account/LensProfileCard";
import { client } from "$lib/utils/lens/client";

import { UserFeed } from "./feed";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const username = (await params).username;

  const result = await fetchAccount(client, {
    username: {
      localName: username,
    },
  });

  if (result.isErr() || !result.value) return notFound();

  return (
    <div className="md:grid md:grid-cols-[336px_1fr] gap-5 md:gap-8 items-start pb-10">
      <LensProfileCard account={result.value} />
      <UserFeed authorId={result.value.address} />
    </div>
  );
}
