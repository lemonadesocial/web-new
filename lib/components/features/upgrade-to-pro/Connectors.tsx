'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Button, Card, InputField, Skeleton, toast, modal, Menu, MenuItem } from '$lib/components/core';
import { Chip } from '$lib/components/core/chip/Chip';
import { useQuery, useMutation } from '$lib/graphql/request';
import {
  AvailableConnectorsDocument,
  SpaceConnectionsDocument,
  type ConnectorDefinition,
  ConnectPlatformDocument,
  type ConnectionOutput,
  DisconnectPlatformDocument,
  SubmitApiKeyDocument,
  type Space
} from '$lib/graphql/generated/backend/graphql';
import { getErrorMessage } from '$lib/utils/error';

import { CONNECTOR_ICONS, getConnectorErrorMessage } from './utils';

type ConnectorsProps = {
  space: Space;
  basePath?: string;
};

export function Connectors({ space, basePath }: ConnectorsProps) {
  const searchParams = useSearchParams();
  const handledQueryRef = React.useRef<string | null>(null);

  const { data, loading, error } = useQuery(
    AvailableConnectorsDocument,
    {},
  );

  const { data: spaceConnectionsData, refetch: refetchSpaceConnections } = useQuery(
    SpaceConnectionsDocument,
    {
      variables: {
        spaceId: space._id,
      },
      skip: !space?._id,
    },
  );

  const connectors = (data?.availableConnectors ?? []) as ConnectorDefinition[];
  const spaceConnections = (spaceConnectionsData?.spaceConnections ?? []) as ConnectionOutput[];

  React.useEffect(() => {
    const queryString = searchParams.toString();

    if (!queryString || handledQueryRef.current === queryString) return;

    const status = searchParams.get('status');
    const errorParam = searchParams.get('error');

    if (!status && !errorParam) return;

    handledQueryRef.current = queryString;

    const url = new URL(window.location.href);
    url.searchParams.delete('status');
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.toString());

    if (errorParam) {
      toast.error(getConnectorErrorMessage(errorParam));
      return;
    }

    if (status === 'connected') {
      toast.success('Connector connected successfully.');
      refetchSpaceConnections();
    }
  }, [refetchSpaceConnections, searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1 hidden md:block">
        <h3 className="text-2xl font-bold">Connectors</h3>
        <p className="text-tertiary">
          Power up your community with connected tools and richer context.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card.Root key={i}>
              <Card.Content className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="size-12 rounded-sm shrink-0" animate />
                  <Skeleton className="h-6 w-16 rounded-full" animate />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" animate />
                  <Skeleton className="h-4 w-full" animate />
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      )}

      {!!error && !loading && <p className="text-danger text-sm">Unable to load connectors.</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {connectors.map((item) => {
            const connection = spaceConnections.find((c) => {
              return c.enabled && c.status === 'connected' && c.connectorType === item.id;
            });

            const isConnected = Boolean(connection);

            return (
              <ConnectorCard
                key={item.id}
                item={item}
                isConnected={isConnected}
                connectionId={connection?.id}
                space={space}
                basePath={basePath}
                refetchSpaceConnections={refetchSpaceConnections}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}


type ConnectorCardProps = {
  item: ConnectorDefinition;
  isConnected: boolean;
  connectionId?: string;
  space: Space;
  basePath?: string;
  refetchSpaceConnections: () => Promise<unknown>;
};

function ConnectorCard({ item, isConnected, connectionId, space, basePath, refetchSpaceConnections }: ConnectorCardProps) {
  const router = useRouter();
  const icon = CONNECTOR_ICONS[item.id] ?? CONNECTOR_ICONS[item.icon];
  const connectorBasePath = basePath ?? `/s/manage/${space.slug || space._id}/settings/connectors`;
  const handleViewActions = React.useCallback(() => {
    if (!connectionId) return;

    router.push(`${connectorBasePath}/${connectionId}`);
  }, [connectionId, connectorBasePath, router]);

  const [connectPlatform, { loading }] = useMutation(ConnectPlatformDocument, {
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Unable to connect. Please try again.'));
    },
  });

  const handleConnect = async () => {
    if (loading || isConnected) return;

    const { data } = await connectPlatform({
      variables: {
        input: {
          spaceId: space._id,
          connectorType: item.id,
        },
      },
    });

    const result = data?.connectPlatform;

    if (!result) return;

    if (result.authUrl) {
      window.location.href = result.authUrl;
      return;
    }

    if (result.requiresApiKey) {
      modal.open(ApiKeyModal, {
        props: {
          item,
          connectionId: result.connectionId,
          refetchSpaceConnections,
        },
      });
    }
  };

  const [disconnectPlatform, { loading: disconnecting }] = useMutation(DisconnectPlatformDocument, {
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Unable to disconnect. Please try again.'));
    },
  });

  const handleDisconnect = async (toggle: () => void) => {
    if (!connectionId || disconnecting) return;

    const { data } = await disconnectPlatform({
      variables: {
        connectionId,
      },
    });

    await refetchSpaceConnections();

    const result = data?.disconnectPlatform;
    if (!result) {
      // Unexpected — keep defensive fallback
      toast.success('Connector disconnected.');
      toggle();
      return;
    }

    if (!result.tokenRevoked) {
      // Revocation failure — BE has sanitized revocationError per PRD US-5.3; DO NOT re-sanitize.
      // Toast has no 'warning' variant; reuse error (red).
      toast.error(
        result.revocationError ??
          'Token could not be revoked on the external platform. Please revoke access manually in the provider settings.',
      );
    } else {
      toast.success('Connector disconnected.');
    }
    toggle();
  };

  return (
    <Card.Root onClick={isConnected ? handleViewActions : handleConnect}>
      <Card.Content className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="size-12 flex items-center justify-center rounded-sm bg-overlay-primary overflow-hidden">
            {icon ? (
              <img src={icon} alt="" className="size-full object-contain" />
            ) : (
              <span className="text-xs font-medium uppercase">{item.name?.slice(0, 2) ?? item.icon}</span>
            )}
          </div>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <Chip size="xs" variant="success" className="rounded-full h-6">
                Connected
              </Chip>
              {connectionId && (
                <Menu.Root>
                  <Menu.Trigger>
                    <Button
                      icon="icon-more-vert"
                      size="xs"
                      variant="tertiary-alt"
                      className="rounded-full h-6"
                      aria-label="More actions"
                      loading={disconnecting}
                    />
                  </Menu.Trigger>
                  <Menu.Content className="p-1 min-w-40">
                    {({ toggle }) => (
                      <>
                        <MenuItem
                          onClick={() => {
                            toggle();
                            handleViewActions();
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <i aria-hidden="true" className="icon-ads-click size-4 text-primary" />
                            <p className="text-sm text-primary">View Actions</p>
                          </div>
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDisconnect(toggle)}
                        >
                          <div className="flex items-center gap-2.5">
                            <i aria-hidden="true" className="icon-delete size-4 text-error" />
                            <p className="text-sm text-error">Disconnect</p>
                          </div>
                        </MenuItem>
                      </>
                    )}
                  </Menu.Content>
                </Menu.Root>
              )}
            </div>
          ) : loading ? (
            <i aria-hidden="true" className="icon-loader size-4 text-tertiary animate-spin" />
          ) : (
            <Chip size="xs" variant="secondary" className="rounded-full h-6">
              Connect
            </Chip>
          )}
        </div>

        <div>
          <p className="text-lg">{item.name}</p>
          <p className="text-tertiary text-sm">{item.description}</p>
        </div>
      </Card.Content>
    </Card.Root>
  );
}


type ApiKeyModalProps = {
  item: ConnectorDefinition;
  connectionId: string;
  refetchSpaceConnections: () => Promise<unknown>;
};

function ApiKeyModal({ item, connectionId, refetchSpaceConnections }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = React.useState('');
  const icon = CONNECTOR_ICONS[item.id] ?? CONNECTOR_ICONS[item.icon];

  const [submitApiKey, { loading }] = useMutation(SubmitApiKeyDocument, {
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Unable to connect. Please try again.'));
    },
    onComplete() {
      refetchSpaceConnections();

      toast.success('Connector linked successfully.');
      modal.close();
    }
  });

  const handleSubmit = async () => {
    if (!apiKey) return;

    submitApiKey({
      variables: {
        input: {
          apiKey,
          connectionId,
        },
      },
    });
  };

  return (
    <div className="w-120 max-w-full rounded-md p-4 space-y-4">
      <div className="flex items-start justify-between">
        {icon && (
          <img src={icon} alt="" className="size-14 rounded-sm object-contain" />
        )
        }
        <Button
          icon="icon-x"
          size="xs"
          variant="tertiary"
          className="rounded-full"
          onClick={() => modal.close()}
          aria-label="Close"
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <p>
            Connect {item.name ?? item.id}
          </p>
          <p className="text-sm text-secondary">
            Enter your API key to connect {item.name ?? item.id}. Your key is stored securely and only used to power this integration.
          </p>
        </div>
        <InputField
          label="API Key"
          type="password"
          value={apiKey}
          onChangeText={setApiKey}
        />
        <Button
          className="w-full"
          variant="secondary"
          loading={loading}
          disabled={!apiKey}
          onClick={handleSubmit}
        >
          Connect
        </Button>
      </div>
    </div>
  );
}
