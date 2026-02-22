/**
 * Page Builder GraphQL Query & Mutation Documents
 *
 * Manual `gql` tagged templates matching the fragments and operations defined
 * in `lib/graphql/gql/backend/page-config.gql`.
 *
 * TODO: Replace with generated typed documents once `yarn codegen` runs
 * against the backend branch that includes the page-config schema.
 */

import { gql } from 'graphql-request';

// ---------------------------------------------------------------------------
// Fragments (inlined into operations below)
// ---------------------------------------------------------------------------

const PAGE_CONFIG_THEME_FIELDS = `
  mode
  type
  colors {
    accent
    background
    card
    text_primary
    text_secondary
    border
  }
  fonts {
    title {
      family
      url
      weight
      size_scale
    }
    body {
      family
      url
      weight
      size_scale
    }
  }
  background {
    type
    value
    config
  }
  effects {
    type
    value
    config
  }
  css_variables
`;

const PAGE_CONFIG_SECTION_FIELDS = `
  id
  type
  order
  hidden
  layout {
    width
    padding
    columns
    alignment
    min_height
    background {
      type
      value
    }
  }
  props
  data_binding {
    mode
    source {
      type
      field
    }
    overrides
  }
  children {
    id
    type
    order
    hidden
    layout {
      width
      padding
      columns
      alignment
      min_height
      background {
        type
        value
      }
    }
    props
    data_binding {
      mode
      source {
        type
        field
      }
      overrides
    }
    children {
      id
      type
      order
      hidden
      layout {
        width
        padding
        columns
        alignment
        min_height
        background {
          type
          value
        }
      }
      props
      craft_node_id
    }
    craft_node_id
  }
  craft_node_id
`;

const PAGE_CONFIG_FIELDS = `
  _id
  owner_type
  owner_id
  created_by
  space_id
  status
  version
  published_version
  theme {
    ${PAGE_CONFIG_THEME_FIELDS}
  }
  sections {
    ${PAGE_CONFIG_SECTION_FIELDS}
  }
  custom_code {
    css
    head_html
    body_html
    scripts {
      src
      content
      strategy
    }
  }
  seo {
    meta_title
    meta_description
    og_image_url
    og_type
    canonical_url
    no_index
    structured_data {
      type
      custom
    }
  }
  name
  description
  thumbnail_url
  template_id
  template_version_installed
  preview_links {
    id
    token
    expires_at
    created_by
    created_at
    view_count
  }
  locked_by
  locked_at
  last_edited_by
  created_at
  updated_at
`;

const CONFIG_VERSION_FIELDS = `
  _id
  config_id
  version
  snapshot {
    ${PAGE_CONFIG_FIELDS}
  }
  change_summary
  created_by
  created_at
`;

const LOCK_RESULT_FIELDS = `
  success
  locked_by
  locked_at
  message
`;

const PREVIEW_LINK_RESPONSE_FIELDS = `
  id
  token
  url
  expires_at
`;

const SECTION_CATALOG_ITEM_FIELDS = `
  type
  name
  description
  category
  tier_required
`;

const AI_SUGGESTED_SECTION_FIELDS = `
  type
  name
  description
  props
  layout
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const GET_PAGE_CONFIG = gql`
  query GetPageConfig($id: ID!) {
    getPageConfig(id: $id) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const GET_PUBLISHED_CONFIG = gql`
  query GetPublishedConfig($ownerType: String!, $ownerId: ID!) {
    getPublishedConfig(ownerType: $ownerType, ownerId: $ownerId) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const LIST_CONFIG_VERSIONS = gql`
  query ListConfigVersions($configId: ID!) {
    listConfigVersions(configId: $configId) {
      ${CONFIG_VERSION_FIELDS}
    }
  }
`;

export const VALIDATE_PREVIEW_LINK = gql`
  query ValidatePreviewLink($configId: ID!, $token: String!, $password: String) {
    validatePreviewLink(configId: $configId, token: $token, password: $password) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const GET_SECTION_CATALOG = gql`
  query GetSectionCatalog {
    getSectionCatalog {
      ${SECTION_CATALOG_ITEM_FIELDS}
    }
  }
`;

export const AI_SUGGEST_SECTIONS = gql`
  query AiSuggestSections($ownerType: String!, $ownerId: ID!, $description: String) {
    aiSuggestSections(ownerType: $ownerType, ownerId: $ownerId, description: $description) {
      ${AI_SUGGESTED_SECTION_FIELDS}
    }
  }
`;

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const CREATE_PAGE_CONFIG = gql`
  mutation CreatePageConfig($input: CreatePageConfigInput!) {
    createPageConfig(input: $input) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const UPDATE_PAGE_CONFIG = gql`
  mutation UpdatePageConfig($id: ID!, $input: UpdatePageConfigInput!) {
    updatePageConfig(id: $id, input: $input) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const PUBLISH_PAGE_CONFIG = gql`
  mutation PublishPageConfig($id: ID!) {
    publishPageConfig(id: $id) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const ARCHIVE_PAGE_CONFIG = gql`
  mutation ArchivePageConfig($id: ID!) {
    archivePageConfig(id: $id) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const SAVE_CONFIG_VERSION = gql`
  mutation SaveConfigVersion($configId: ID!, $changeSummary: String) {
    saveConfigVersion(configId: $configId, changeSummary: $changeSummary) {
      ${CONFIG_VERSION_FIELDS}
    }
  }
`;

export const RESTORE_CONFIG_VERSION = gql`
  mutation RestoreConfigVersion($configId: ID!, $version: Int!) {
    restoreConfigVersion(configId: $configId, version: $version) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const ACQUIRE_CONFIG_LOCK = gql`
  mutation AcquireConfigLock($configId: ID!) {
    acquireConfigLock(configId: $configId) {
      ${LOCK_RESULT_FIELDS}
    }
  }
`;

export const RELEASE_CONFIG_LOCK = gql`
  mutation ReleaseConfigLock($configId: ID!) {
    releaseConfigLock(configId: $configId)
  }
`;

export const HEARTBEAT_CONFIG_LOCK = gql`
  mutation HeartbeatConfigLock($configId: ID!) {
    heartbeatConfigLock(configId: $configId)
  }
`;

export const GENERATE_PREVIEW_LINK = gql`
  mutation GeneratePreviewLink($configId: ID!, $password: String, $expiresInHours: Float) {
    generatePreviewLink(configId: $configId, password: $password, expiresInHours: $expiresInHours) {
      ${PREVIEW_LINK_RESPONSE_FIELDS}
    }
  }
`;

// ---------------------------------------------------------------------------
// AI Mutations
// ---------------------------------------------------------------------------

export const AI_CREATE_PAGE_CONFIG = gql`
  mutation AiCreatePageConfig($input: AICreatePageConfigInput!) {
    aiCreatePageConfig(input: $input) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const AI_UPDATE_PAGE_CONFIG_SECTION = gql`
  mutation AiUpdatePageConfigSection($configId: ID!, $sectionIndex: Int!, $input: AIUpdatePageConfigSectionInput!) {
    aiUpdatePageConfigSection(configId: $configId, sectionIndex: $sectionIndex, input: $input) {
      ${PAGE_CONFIG_SECTION_FIELDS}
    }
  }
`;

export const AI_GENERATE_PAGE_FROM_DESCRIPTION = gql`
  mutation AiGeneratePageFromDescription($description: String!, $ownerType: String!, $ownerId: ID!) {
    aiGeneratePageFromDescription(description: $description, ownerType: $ownerType, ownerId: $ownerId) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

// ---------------------------------------------------------------------------
// Template Queries & Mutations
// ---------------------------------------------------------------------------

const TEMPLATE_FIELDS = `
  _id
  name
  slug
  description
  category
  tags
  config {
    ${PAGE_CONFIG_FIELDS}
  }
  thumbnail_url
  preview_urls
  preview_video_url
  creator_type
  creator_id
  space_id
  target
  visibility
  subscription_tier_min
  marketplace_listed
  price_cents
  currency
  install_count
  rating_average
  rating_count
  version
  changelog {
    version
    date
    summary
    breaking_changes
  }
  created_at
  updated_at
  published_at
`;

export const LIST_TEMPLATES = gql`
  query ListTemplates($filters: ListTemplatesArgs) {
    listTemplates(filters: $filters) {
      ${TEMPLATE_FIELDS}
    }
  }
`;

export const GET_TEMPLATE = gql`
  query GetTemplate($id: ID!) {
    getTemplate(id: $id) {
      ${TEMPLATE_FIELDS}
    }
  }
`;

export const CLONE_TEMPLATE_TO_CONFIG = gql`
  mutation CloneTemplateToConfig($templateId: ID!, $ownerType: String!, $ownerId: ID!) {
    cloneTemplateToConfig(templateId: $templateId, ownerType: $ownerType, ownerId: $ownerId) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

// ---------------------------------------------------------------------------
// Asset Queries & Mutations
// ---------------------------------------------------------------------------

const SPACE_ASSET_FIELDS = `
  _id
  stamp
  state
  owner
  type
  size
  url
  bucket
  key
  description
`;

const STOCK_PHOTO_FIELDS = `
  id
  url
  thumbnail_url
  width
  height
  description
  attribution {
    photographer
    source
    source_url
    license
  }
`;

export const LIST_SPACE_ASSETS = gql`
  query ListSpaceAssets($spaceId: ID!, $limit: Int, $offset: Int) {
    listSpaceAssets(spaceId: $spaceId, limit: $limit, offset: $offset) {
      ${SPACE_ASSET_FIELDS}
    }
  }
`;

export const SEARCH_STOCK_PHOTOS = gql`
  query SearchStockPhotos($query: String!, $source: StockPhotoSource, $page: Int, $perPage: Int) {
    searchStockPhotos(query: $query, source: $source, page: $page, perPage: $perPage) {
      ${STOCK_PHOTO_FIELDS}
    }
  }
`;

export const ADD_SPACE_ASSET = gql`
  mutation AddSpaceAsset($spaceId: ID!, $fileId: ID!) {
    addSpaceAsset(spaceId: $spaceId, fileId: $fileId)
  }
`;

export const DELETE_SPACE_ASSET = gql`
  mutation DeleteSpaceAsset($spaceId: ID!, $fileId: ID!) {
    deleteSpaceAsset(spaceId: $spaceId, fileId: $fileId)
  }
`;

// ---------------------------------------------------------------------------
// Template Lifecycle Mutations
// ---------------------------------------------------------------------------

const TEMPLATE_UPDATE_INFO_FIELDS = `
  has_update
  current_version
  latest_version
  changelog {
    version
    date
    summary
    breaking_changes
  }
`;

export const SAVE_CONFIG_AS_TEMPLATE = gql`
  mutation SaveConfigAsTemplate($configId: ID!, $input: SaveAsTemplateInput!) {
    saveConfigAsTemplate(configId: $configId, input: $input) {
      ${TEMPLATE_FIELDS}
    }
  }
`;

export const CHECK_TEMPLATE_UPDATE = gql`
  query CheckTemplateUpdate($configId: ID!) {
    checkTemplateUpdate(configId: $configId) {
      ${TEMPLATE_UPDATE_INFO_FIELDS}
    }
  }
`;

export const APPLY_TEMPLATE_UPDATE = gql`
  mutation ApplyTemplateUpdate($configId: ID!) {
    applyTemplateUpdate(configId: $configId) {
      ${PAGE_CONFIG_FIELDS}
    }
  }
`;

export const PUBLISH_TEMPLATE_UPDATE = gql`
  mutation PublishTemplateUpdate($templateId: ID!, $input: TemplateUpdateInput!) {
    publishTemplateUpdate(templateId: $templateId, input: $input) {
      ${TEMPLATE_FIELDS}
    }
  }
`;
