import type { Config, ConfigFilter, DocumentFilter } from '$lib/graphql/generated/ai/graphql';
import type { Space } from '$lib/graphql/generated/backend/graphql';
import { randomEventDP } from '$lib/utils/user';

const configAvatarFallbackCache = new Map<string, string>();

export type AiManageScope = { type: 'space'; space: Space } | { type: 'user'; userId: string };

export function getAiConfigFilter(scope: AiManageScope): ConfigFilter {
  if (scope.type === 'space') {
    return { spaces_in: [scope.space._id] };
  }

  return { user_eq: scope.userId };
}

export function getAiDocumentFilter(scope: AiManageScope): DocumentFilter | undefined {
  if (scope.type === 'user') {
    return { user_eq: scope.userId };
  }

  return undefined;
}

export function getScopeSpace(scope: AiManageScope): Space | undefined {
  return scope.type === 'space' ? scope.space : undefined;
}

export function getDefaultActiveSpaces(scope: AiManageScope): Space[] {
  return scope.type === 'space' ? [scope.space] : [];
}

export function getConfigDocumentIds(config: Pick<Config, 'documents' | 'documentsExpanded'>): string[] {
  return Array.from(
    new Set([...(config.documents ?? []), ...(config.documentsExpanded ?? []).map((document) => document._id)]),
  );
}

export function getConfigAvatarSrc(config: Pick<Config, '_id' | 'avatar'>): string {
  if (config.avatar) {
    return config.avatar;
  }

  const cached = configAvatarFallbackCache.get(config._id);

  if (cached) {
    return cached;
  }

  const avatarSrc = randomEventDP(config._id);
  configAvatarFallbackCache.set(config._id, avatarSrc);
  return avatarSrc;
}
