import {
  TextOnlyMetadataFragment,
  ImageMetadataFragment,
  LinkMetadataFragment,
  MintMetadataFragment,
  EventMetadataFragment,
  graphql
} from "@lens-protocol/client";

export const PostMetadataFragment = graphql(
  `
    fragment PostMetadata on PostMetadata {
      __typename
      ... on MintMetadata {
        ...MintMetadata
      }
      ... on TextOnlyMetadata {
        ...TextOnlyMetadata
      }
      ... on ImageMetadata {
        ...ImageMetadata
      }
      ... on LinkMetadata {
        ...LinkMetadata
      }
      ... on EventMetadata {
        ...EventMetadata
      }
    }
  `,
  [
    MintMetadataFragment,
    TextOnlyMetadataFragment,
    ImageMetadataFragment,
    LinkMetadataFragment,
    EventMetadataFragment,
  ]
);
