import { ResolvingMetadata } from "next";

import CommunityLayout from "$lib/components/layouts/community";
import { generateUrl } from "$lib/utils/cnd";
import { getSpace } from "$lib/utils/getSpace";
import { isObjectId } from "$lib/utils/helpers";

type Props = { params: Promise<{ domain: string, uid: string }> };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata) {
  const res = await params;
  const uid = res.uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid} : { slug: uid };

  const space = await getSpace(variables);
  const previousImages = (await parent).openGraph?.images || [];
  let images = [...previousImages];

  if (space?.image_cover_expanded) {
    images = [generateUrl(space?.image_cover_expanded), ...images];
  }

  return {
    title: space?.title,
    description: space?.description,
    openGraph: {
      images,
    },
  };
}

export default CommunityLayout; 
