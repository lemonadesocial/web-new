/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetMe {\n  getMe {\n    _id\n    name\n    image_avatar\n  }\n}": typeof types.GetMeDocument,
    "mutation createFileUploads($uploadInfos: [FileUploadInfo!]!, $directory: String!) {\n  createFileUploads(upload_infos: $uploadInfos, directory: $directory) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    presignedUrl: presigned_url\n  }\n}\n\nmutation confirmFileUploads($ids: [MongoID!]!) {\n  confirmFileUploads(ids: $ids)\n}\n\nmutation updateFileDescriptionMutation($input: FileInput!, $id: MongoID!) {\n  updateFile(input: $input, _id: $id) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    description\n  }\n}": typeof types.CreateFileUploadsDocument,
    "fragment Space on Space {\n  _id\n  title\n  admins {\n    _id\n    image_avatar\n  }\n  description\n  is_ambassador\n  followed\n  followers\n  image_avatar\n  image_avatar_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  image_cover\n  image_cover_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  creator\n  creator_expanded {\n    _id\n    name\n    image_avatar\n  }\n  slug\n  private\n  listed_events\n  website\n  address {\n    _id\n    city\n    country\n    latitude\n    longitude\n    street_1\n    street_2\n    region\n    title\n  }\n  handle_instagram\n  handle_twitter\n  handle_linkedin\n  handle_youtube\n  handle_tiktok\n  personal\n}\n\nfragment SpaceTag on SpaceTagBase {\n  _id\n  color\n  space\n  tag\n  targets\n  type\n}\n\nquery GetSpace($id: MongoID, $slug: String) {\n  getSpace(_id: $id, slug: $slug) {\n    ...Space\n  }\n}\n\nquery GetSpaceEvents($skip: Int, $limit: Int, $startFrom: DateTimeISO, $startTo: DateTimeISO, $space: MongoID, $sort: EventSortInput, $endFrom: DateTimeISO, $endTo: DateTimeISO, $spaceTags: [MongoID!]) {\n  getEvents(\n    skip: $skip\n    limit: $limit\n    start_from: $startFrom\n    start_to: $startTo\n    space: $space\n    sort: $sort\n    end_from: $endFrom\n    end_to: $endTo\n    space_tags: $spaceTags\n  ) {\n    _id\n    shortid\n    title\n    host_expanded {\n      _id\n      image_avatar\n      name\n    }\n    address {\n      city\n      country\n      region\n      latitude\n      longitude\n    }\n    new_new_photos_expanded {\n      _id\n      bucket\n      key\n      type\n      url\n    }\n    start\n    end\n    event_ticket_types {\n      _id\n      prices {\n        cost\n        currency\n        default\n      }\n    }\n    host_expanded {\n      _id\n      image_avatar\n    }\n    visible_cohosts_expanded {\n      _id\n      image_avatar\n    }\n  }\n}\n\nquery GetSpaceEventsCalendar($space: MongoID) {\n  getEvents(space: $space) {\n    _id\n    start\n    address {\n      _id\n      latitude\n      longitude\n    }\n  }\n}\n\nquery GetSpaceTags($space: MongoID!) {\n  listSpaceTags(space: $space) {\n    ...SpaceTag\n  }\n}\n\nmutation FollowSpace($space: MongoID!) {\n  followSpace(space: $space)\n}\n\nmutation UnfollowSpace($space: MongoID!) {\n  unfollowSpace(space: $space)\n}": typeof types.SpaceFragmentDoc,
};
const documents: Documents = {
    "query GetMe {\n  getMe {\n    _id\n    name\n    image_avatar\n  }\n}": types.GetMeDocument,
    "mutation createFileUploads($uploadInfos: [FileUploadInfo!]!, $directory: String!) {\n  createFileUploads(upload_infos: $uploadInfos, directory: $directory) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    presignedUrl: presigned_url\n  }\n}\n\nmutation confirmFileUploads($ids: [MongoID!]!) {\n  confirmFileUploads(ids: $ids)\n}\n\nmutation updateFileDescriptionMutation($input: FileInput!, $id: MongoID!) {\n  updateFile(input: $input, _id: $id) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    description\n  }\n}": types.CreateFileUploadsDocument,
    "fragment Space on Space {\n  _id\n  title\n  admins {\n    _id\n    image_avatar\n  }\n  description\n  is_ambassador\n  followed\n  followers\n  image_avatar\n  image_avatar_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  image_cover\n  image_cover_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  creator\n  creator_expanded {\n    _id\n    name\n    image_avatar\n  }\n  slug\n  private\n  listed_events\n  website\n  address {\n    _id\n    city\n    country\n    latitude\n    longitude\n    street_1\n    street_2\n    region\n    title\n  }\n  handle_instagram\n  handle_twitter\n  handle_linkedin\n  handle_youtube\n  handle_tiktok\n  personal\n}\n\nfragment SpaceTag on SpaceTagBase {\n  _id\n  color\n  space\n  tag\n  targets\n  type\n}\n\nquery GetSpace($id: MongoID, $slug: String) {\n  getSpace(_id: $id, slug: $slug) {\n    ...Space\n  }\n}\n\nquery GetSpaceEvents($skip: Int, $limit: Int, $startFrom: DateTimeISO, $startTo: DateTimeISO, $space: MongoID, $sort: EventSortInput, $endFrom: DateTimeISO, $endTo: DateTimeISO, $spaceTags: [MongoID!]) {\n  getEvents(\n    skip: $skip\n    limit: $limit\n    start_from: $startFrom\n    start_to: $startTo\n    space: $space\n    sort: $sort\n    end_from: $endFrom\n    end_to: $endTo\n    space_tags: $spaceTags\n  ) {\n    _id\n    shortid\n    title\n    host_expanded {\n      _id\n      image_avatar\n      name\n    }\n    address {\n      city\n      country\n      region\n      latitude\n      longitude\n    }\n    new_new_photos_expanded {\n      _id\n      bucket\n      key\n      type\n      url\n    }\n    start\n    end\n    event_ticket_types {\n      _id\n      prices {\n        cost\n        currency\n        default\n      }\n    }\n    host_expanded {\n      _id\n      image_avatar\n    }\n    visible_cohosts_expanded {\n      _id\n      image_avatar\n    }\n  }\n}\n\nquery GetSpaceEventsCalendar($space: MongoID) {\n  getEvents(space: $space) {\n    _id\n    start\n    address {\n      _id\n      latitude\n      longitude\n    }\n  }\n}\n\nquery GetSpaceTags($space: MongoID!) {\n  listSpaceTags(space: $space) {\n    ...SpaceTag\n  }\n}\n\nmutation FollowSpace($space: MongoID!) {\n  followSpace(space: $space)\n}\n\nmutation UnfollowSpace($space: MongoID!) {\n  unfollowSpace(space: $space)\n}": types.SpaceFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetMe {\n  getMe {\n    _id\n    name\n    image_avatar\n  }\n}"): (typeof documents)["query GetMe {\n  getMe {\n    _id\n    name\n    image_avatar\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createFileUploads($uploadInfos: [FileUploadInfo!]!, $directory: String!) {\n  createFileUploads(upload_infos: $uploadInfos, directory: $directory) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    presignedUrl: presigned_url\n  }\n}\n\nmutation confirmFileUploads($ids: [MongoID!]!) {\n  confirmFileUploads(ids: $ids)\n}\n\nmutation updateFileDescriptionMutation($input: FileInput!, $id: MongoID!) {\n  updateFile(input: $input, _id: $id) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    description\n  }\n}"): (typeof documents)["mutation createFileUploads($uploadInfos: [FileUploadInfo!]!, $directory: String!) {\n  createFileUploads(upload_infos: $uploadInfos, directory: $directory) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    presignedUrl: presigned_url\n  }\n}\n\nmutation confirmFileUploads($ids: [MongoID!]!) {\n  confirmFileUploads(ids: $ids)\n}\n\nmutation updateFileDescriptionMutation($input: FileInput!, $id: MongoID!) {\n  updateFile(input: $input, _id: $id) {\n    _id\n    stamp\n    state\n    owner\n    type\n    size\n    url\n    bucket\n    key\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment Space on Space {\n  _id\n  title\n  admins {\n    _id\n    image_avatar\n  }\n  description\n  is_ambassador\n  followed\n  followers\n  image_avatar\n  image_avatar_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  image_cover\n  image_cover_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  creator\n  creator_expanded {\n    _id\n    name\n    image_avatar\n  }\n  slug\n  private\n  listed_events\n  website\n  address {\n    _id\n    city\n    country\n    latitude\n    longitude\n    street_1\n    street_2\n    region\n    title\n  }\n  handle_instagram\n  handle_twitter\n  handle_linkedin\n  handle_youtube\n  handle_tiktok\n  personal\n}\n\nfragment SpaceTag on SpaceTagBase {\n  _id\n  color\n  space\n  tag\n  targets\n  type\n}\n\nquery GetSpace($id: MongoID, $slug: String) {\n  getSpace(_id: $id, slug: $slug) {\n    ...Space\n  }\n}\n\nquery GetSpaceEvents($skip: Int, $limit: Int, $startFrom: DateTimeISO, $startTo: DateTimeISO, $space: MongoID, $sort: EventSortInput, $endFrom: DateTimeISO, $endTo: DateTimeISO, $spaceTags: [MongoID!]) {\n  getEvents(\n    skip: $skip\n    limit: $limit\n    start_from: $startFrom\n    start_to: $startTo\n    space: $space\n    sort: $sort\n    end_from: $endFrom\n    end_to: $endTo\n    space_tags: $spaceTags\n  ) {\n    _id\n    shortid\n    title\n    host_expanded {\n      _id\n      image_avatar\n      name\n    }\n    address {\n      city\n      country\n      region\n      latitude\n      longitude\n    }\n    new_new_photos_expanded {\n      _id\n      bucket\n      key\n      type\n      url\n    }\n    start\n    end\n    event_ticket_types {\n      _id\n      prices {\n        cost\n        currency\n        default\n      }\n    }\n    host_expanded {\n      _id\n      image_avatar\n    }\n    visible_cohosts_expanded {\n      _id\n      image_avatar\n    }\n  }\n}\n\nquery GetSpaceEventsCalendar($space: MongoID) {\n  getEvents(space: $space) {\n    _id\n    start\n    address {\n      _id\n      latitude\n      longitude\n    }\n  }\n}\n\nquery GetSpaceTags($space: MongoID!) {\n  listSpaceTags(space: $space) {\n    ...SpaceTag\n  }\n}\n\nmutation FollowSpace($space: MongoID!) {\n  followSpace(space: $space)\n}\n\nmutation UnfollowSpace($space: MongoID!) {\n  unfollowSpace(space: $space)\n}"): (typeof documents)["fragment Space on Space {\n  _id\n  title\n  admins {\n    _id\n    image_avatar\n  }\n  description\n  is_ambassador\n  followed\n  followers\n  image_avatar\n  image_avatar_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  image_cover\n  image_cover_expanded {\n    _id\n    bucket\n    url\n    type\n    key\n  }\n  creator\n  creator_expanded {\n    _id\n    name\n    image_avatar\n  }\n  slug\n  private\n  listed_events\n  website\n  address {\n    _id\n    city\n    country\n    latitude\n    longitude\n    street_1\n    street_2\n    region\n    title\n  }\n  handle_instagram\n  handle_twitter\n  handle_linkedin\n  handle_youtube\n  handle_tiktok\n  personal\n}\n\nfragment SpaceTag on SpaceTagBase {\n  _id\n  color\n  space\n  tag\n  targets\n  type\n}\n\nquery GetSpace($id: MongoID, $slug: String) {\n  getSpace(_id: $id, slug: $slug) {\n    ...Space\n  }\n}\n\nquery GetSpaceEvents($skip: Int, $limit: Int, $startFrom: DateTimeISO, $startTo: DateTimeISO, $space: MongoID, $sort: EventSortInput, $endFrom: DateTimeISO, $endTo: DateTimeISO, $spaceTags: [MongoID!]) {\n  getEvents(\n    skip: $skip\n    limit: $limit\n    start_from: $startFrom\n    start_to: $startTo\n    space: $space\n    sort: $sort\n    end_from: $endFrom\n    end_to: $endTo\n    space_tags: $spaceTags\n  ) {\n    _id\n    shortid\n    title\n    host_expanded {\n      _id\n      image_avatar\n      name\n    }\n    address {\n      city\n      country\n      region\n      latitude\n      longitude\n    }\n    new_new_photos_expanded {\n      _id\n      bucket\n      key\n      type\n      url\n    }\n    start\n    end\n    event_ticket_types {\n      _id\n      prices {\n        cost\n        currency\n        default\n      }\n    }\n    host_expanded {\n      _id\n      image_avatar\n    }\n    visible_cohosts_expanded {\n      _id\n      image_avatar\n    }\n  }\n}\n\nquery GetSpaceEventsCalendar($space: MongoID) {\n  getEvents(space: $space) {\n    _id\n    start\n    address {\n      _id\n      latitude\n      longitude\n    }\n  }\n}\n\nquery GetSpaceTags($space: MongoID!) {\n  listSpaceTags(space: $space) {\n    ...SpaceTag\n  }\n}\n\nmutation FollowSpace($space: MongoID!) {\n  followSpace(space: $space)\n}\n\nmutation UnfollowSpace($space: MongoID!) {\n  unfollowSpace(space: $space)\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;