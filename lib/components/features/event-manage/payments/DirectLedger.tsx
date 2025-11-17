'use client';
import clsx from 'clsx';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  InputField,
  Menu,
  MenuItem,
  Skeleton,
} from '$lib/components/core';
import { useClient, useQuery } from '$lib/graphql/request';
import {
  GetEventPaymentStatisticsDocument,
  GetListEventPaymentsDocument,
  GetTicketStatisticsDocument,
  NewPaymentProvider,
  NewPaymentState,
} from '$lib/graphql/generated/backend/graphql';
import { useEvent } from '../store';
import React from 'react';
import { CardTable } from '$lib/components/core/table';
import { userAvatar } from '$lib/utils/user';
import { format, isValid } from 'date-fns';
import { debounce, sumBy } from 'lodash';
import { match, P } from 'ts-pattern';
import { useAtomValue } from 'jotai';
import { listChainsAtom } from '$lib/jotai';
import { downloadFile, makeCSV } from '$lib/utils/file';

const LIMIT = 10;
const filterMenuGuest: Record<string, { icon: string; label: string }> = {
  all: { icon: 'ic_guests', label: 'All Guests' },
  checked_in: { icon: 'ic_enter', label: 'Checked in' },
  not_checked_in: { icon: 'ic_close_circle', label: 'Not Checked In' },
};

export function DirectLedger() {
  const event = useEvent();
  if (!event) return null;

  const { client } = useClient();
  const chains = useAtomValue(listChainsAtom);
  const { data: dataEventPaymentStats } = useQuery(GetEventPaymentStatisticsDocument, {
    variables: { event: event._id },
  });

  const paymentStatistics = dataEventPaymentStats?.getEventPaymentStatistics;
  console.log(paymentStatistics)
  const statics = [
    { icon: 'icon-user-group-outline', title: paymentStatistics?.total_payments || 0, subtitle: 'Total Transactions' },
    {
      icon: 'icon-credit-card',
      title: paymentStatistics?.stripe_payments?.count || 0,
      subtitle: 'Card Transactions',
    },
    {
      icon: 'icon-wallet',
      title: paymentStatistics?.crypto_payments?.count || 0,
      subtitle: 'Crypto Transactions',
    },
  ];

  const [skip, setSkip] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);

  const [filter, setFilter] = React.useState('all');
  const [filterTickets, setFilterTickets] = React.useState<string[]>([]);
  const [filterNetworks, setFilterNetworks] = React.useState<string[]>([]);

  const { data: dataListEventPayments, loading } = useQuery(GetListEventPaymentsDocument, {
    variables: {
      skip,
      limit: LIMIT,
      event: event._id,
      checked_in: filter === 'all' ? undefined : filter == 'checked_in',
      ticket_types: filterTickets.length ? filterTickets : undefined,
      provider: filterNetworks.find((item) => item === 'stripe') ? NewPaymentProvider.Stripe : undefined,
      networks: filterNetworks.length ? filterNetworks.filter((item) => item !== 'stripe') : undefined,
      search: query.trim() || undefined,
    },
    skip: !event._id,
  });
  const dataSource = dataListEventPayments?.listEventPayments.records || [];

  const { data: dataTicketStats } = useQuery(GetTicketStatisticsDocument, { variables: { id: event._id } });

  const download = async () => {
    const { data: list } = await client.query({
      query: GetListEventPaymentsDocument,
      variables: {
        event: event._id,
        checked_in: filter === 'all' ? undefined : filter == 'checked_in',
        ticket_types: filterTickets.length ? filterTickets : undefined,
        provider: filterNetworks.find((item) => item === 'stripe') ? NewPaymentProvider.Stripe : undefined,
        networks: filterNetworks.length ? filterNetworks.filter((item) => item !== 'stripe') : undefined,
        search: query.trim() || undefined,
      },
    });

    const records = list?.listEventPayments?.records || [];
    let ds = [
      [
        'ID',
        'Name',
        'Email',
        'Purchase Date',
        'Ticket Tiers',
        'Amount',
        'Currency',
        'Promo Code',
        'Discount Amount',
        'NetWork',
        'Payment Method',
        'Payment ID/Trx',
        'Payment status',
      ],
    ];

    records
      .filter((item) => (selected.length ? selected.indexOf(item._id) >= 0 : true))
      .forEach((item) => {
        const name = item.buyer_info?.name || item.buyer_user?.name;
        const email = item.buyer_info?.email || item.buyer_user?.email;
        const purchaseDate = isValid(new Date(item.stamps['initialized']))
          ? format(new Date(item.stamps['initialized']), 'dd/MM/yyyy')
          : '';
        const ticketTiers = item.ticket_types_expanded
          ?.map((p) => p?.category_expanded?.title)
          .filter(Boolean)
          .join(',');
        const network = window?.supportedPaymentChains?.find((c) => c.chain_id === item.crypto_payment_info?.network);
        const paymentMethod =
          item.account_expanded?.provider === NewPaymentProvider.Stripe
            ? item.stripe_payment_info?.card?.brand || '' + ' ' + item.stripe_payment_info?.card?.last4 || ''
            : item.transfer_metadata?.from;
        const paymentTransaction =
          item.account_expanded?.provider === NewPaymentProvider.Stripe
            ? item.stripe_payment_info?.payment_intent
            : item.crypto_payment_info?.tx_hash;

        ds.push([
          item._id,
          name,
          email || '',
          purchaseDate,
          ticketTiers,
          item.formatted_total_amount,
          item.currency,
          item.ref_data?.discount || '',
          item.formatted_discount_amount || '',
          network?.name || '',
          paymentMethod || '',
          paymentTransaction || '',
          item.state,
        ]);
      });

    const content = makeCSV(ds);
    downloadFile(content, 'Payments Ledger', 'text/csv');
  };

  const debouncedPerformSearch = React.useCallback(
    debounce((query) => setQuery(query), 500), // 500ms debounce time
    [],
  );

  return (
    <div className="page mx-auto py-6 px-4 md:px-0">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 overflow-y-auto no-scrollbar">
          {statics.map((item, idx) => (
            <CardItem key={idx} {...item} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <h3 className="text-xl font-semibold flex-1">Transactions</h3>
            <Button icon="icon-download" onClick={download} size="sm" variant="tertiary-alt" />
          </div>
          <InputField
            iconLeft="icon-search"
            placeholder="Search"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              debouncedPerformSearch(text);
            }}
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Menu.Root placement="bottom-start">
                <Menu.Trigger>
                  {({ toggle }) => (
                    <>
                      <Button
                        iconLeft="icon-filter-line"
                        onClick={toggle}
                        size="sm"
                        variant="tertiary-alt"
                        className="hidden md:block"
                        iconRight="icon-chevron-down"
                      >
                        {match(filterNetworks.length)
                          .with(P.number.gt(1), () => `Networks (${filterNetworks.length})`)
                          .otherwise(() => {
                            const chain = chains?.find((c) => c.chain_id === filterNetworks[0]);
                            if (!filterNetworks.length) return 'All Networks';
                            else return chain?.name || filterNetworks[0];
                          })}
                      </Button>
                      <Button
                        icon="icon-filter-line"
                        onClick={toggle}
                        size="sm"
                        variant="tertiary-alt"
                        className="md:hidden"
                      />
                    </>
                  )}
                </Menu.Trigger>
                <Menu.Content className="p-2 w-52">
                  {({ toggle }) => (
                    <>
                      <MenuItem
                        title="All Networks"
                        iconLeft="icon-community"
                        onClick={() => setFilterNetworks([])}
                        iconRight={!filterNetworks.length && 'icon-done'}
                      />

                      <MenuItem
                        title={`Stripe (${paymentStatistics?.stripe_payments.count})`}
                        iconLeft="icon-stripe"
                        iconRight={filterNetworks.includes('stripe') && 'icon-done'}
                        onClick={() => {
                          const arr = [...filterNetworks];
                          if (!arr.includes('stripe')) {
                            arr.push('stripe');
                          } else {
                            arr.splice(arr.indexOf('stripe'), 1);
                          }
                          setFilterNetworks(arr);
                          toggle();
                        }}
                      />

                      {paymentStatistics?.crypto_payments?.networks?.map((item, idx) => {
                        const chain = chains?.find((c) => c.chain_id === item.chain_id);
                        return (
                          <MenuItem
                            key={idx}
                            title={`${chain?.name} (${item?.count})`}
                            iconRight={filterNetworks.includes(item.chain_id) && 'icon-done'}
                            onClick={() => {
                              const arr = [...filterNetworks];
                              if (!arr.includes(item.chain_id)) {
                                arr.push(item.chain_id);
                              } else {
                                arr.splice(arr.indexOf(item.chain_id), 1);
                              }
                              setFilterNetworks(arr);
                            }}
                          />
                        );
                      })}
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>

              <Menu.Root placement="bottom-start">
                <Menu.Trigger>
                  {({ toggle }) => (
                    <>
                      <Button
                        iconLeft="icon-filter-line"
                        onClick={toggle}
                        size="sm"
                        variant="tertiary-alt"
                        iconRight="icon-chevron-down"
                        className="hidden md:block"
                      >
                        {filterMenuGuest[filter].label}
                      </Button>
                      <Button
                        icon="icon-filter-line"
                        onClick={toggle}
                        size="sm"
                        variant="tertiary-alt"
                        className="md:hidden"
                      />
                    </>
                  )}
                </Menu.Trigger>
                <Menu.Content className="p-2">
                  {({ toggle }) => (
                    <div className="flex flex-col gap-3">
                      <div>
                        {Object.entries(filterMenuGuest).map(([key, item]) => (
                          <MenuItem
                            key={key}
                            title={item.label}
                            className="w-44"
                            iconRight={key === filter && 'icon-done'}
                            onClick={() => {
                              setFilter(key);
                              toggle();
                            }}
                          />
                        ))}
                      </div>

                      <Divider />
                      <div>
                        {dataTicketStats?.getTicketStatistics?.ticket_types?.map((item) => (
                          <MenuItem
                            key={item.ticket_type}
                            title={`${item.ticket_type_title} (${item.count})`}
                            className="[&_p]:truncate"
                            iconRight={clsx(filterTickets.includes(item.ticket_type) ? 'icon-done' : 'icon-none')}
                            onClick={() => {
                              const arr = [...filterTickets];
                              if (!arr.includes(item.ticket_type)) {
                                arr.push(item.ticket_type);
                              } else {
                                arr.splice(arr.indexOf(item.ticket_type), 1);
                              }
                              setFilterTickets(arr);
                              toggle();
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Menu.Content>
              </Menu.Root>
            </div>

            <Menu.Root placement="bottom-end">
              <Menu.Trigger>
                {({ toggle }) => (
                  <>
                    <Button
                      iconLeft="icon-sort"
                      onClick={toggle}
                      size="sm"
                      variant="tertiary-alt"
                      iconRight="icon-chevron-down"
                      className="hidden md:block"
                    >
                      Register Time
                    </Button>
                    <Button icon="icon-sort" onClick={toggle} size="sm" variant="tertiary-alt" className="md:hidden" />
                  </>
                )}
              </Menu.Trigger>
              <Menu.Content>{({ toggle }) => <>Content menu</>}</Menu.Content>
            </Menu.Root>
          </div>

          <CardTable.Root loading={loading} data={dataSource} className="table table-auto overflow-visible">
            <CardTable.Header>
              <div className="flex gap-3 px-4 py-3 w-full">
                <Checkbox
                  id="select-all"
                  value={selected.length === dataSource.length}
                  onChange={() => {
                    if (selected.length !== dataSource.length) setSelected(dataSource.map((i) => i._id));
                    else setSelected([]);
                  }}
                />
                <p className="flex-1">Guest</p>
                <p className="w-[124px]">date</p>
                <p className="w-[60px]">Ticket</p>
                <p className="w-[108px]">Coupon</p>
                <p className="w-[128px]">Amount</p>
                <p className="w-[96px]">Status</p>
              </div>
            </CardTable.Header>

            <CardTable.Loading rows={10}>
              <Skeleton className="size-8 aspect-square rounded-full" animate />
              <Skeleton className="h-5 w-32" animate />

              <Skeleton className="h-5 w-10" animate />

              <div className="w-[62px] px-[60px] hidden md:block">
                <Skeleton className="h-5 w-16 rounded-full" animate />
              </div>
            </CardTable.Loading>

            <CardTable.EmptyState>
              <div className="flex items-center justify-center p-14">
                <p>No Data</p>
              </div>
            </CardTable.EmptyState>

            {dataSource.map((item) => {
              const chain = chains.find((c) => c.chain_id === item.crypto_payment_info?.network);

              return (
                <CardTable.Row key={item._id}>
                  <div className="flex gap-3 px-4 py-3 items-center justify-between text-tertiary">
                    <Checkbox
                      id={`select-${item._id}`}
                      value={selected.includes(item._id)}
                      onChange={() => {
                        if (selected.includes(item._id)) setSelected((prev) => prev.filter((i) => i !== item._id));
                        else setSelected((prev) => [...prev, item._id]);
                      }}
                    />
                    <div className=" size-6">
                      <Avatar src={item.buyer_user?.image_avatar || userAvatar()} className="aspect-square" />
                    </div>
                    <div className="flex gap-2 flex-1">
                      <p className="text-primary min-w-fit">
                        {item.buyer_user?.display_name || item.buyer_user?.name || item.buyer_info?.name}
                      </p>
                      <p className="truncate">{item.buyer_user?.email || item.buyer_info?.email}</p>
                    </div>

                    <div className="w-[124px]">
                      <p>
                        {isValid(new Date(item.stamps['initialized']))
                          ? format(new Date(item.stamps['initialized']), 'dd/MM/yyyy')
                          : ''}
                      </p>
                    </div>
                    <div className="w-[60px]">
                      <Badge color="var(--color-secondary)" className="rounded-full flex gap-1">
                        <i className="icon-ticket size-3 aspect-square" />
                        <span className="text-xs">{sumBy(item.ref_data.items || [], 'count')}</span>
                      </Badge>
                    </div>
                    <div className="w-[108px]">
                      {item.ref_data.discount ? (
                        <Badge color="var(--color-accent-400)" className="flex gap-1">
                          <i className="icon-discount size-3 aspect-square" />
                          {item.ref_data.discount}
                        </Badge>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center w-[128px]">
                      {item.account_expanded?.provider === NewPaymentProvider.Stripe ? (
                        <i className="icon-stripe size-5 aspect-square" />
                      ) : (
                        <img src={chain?.logo_url as string} width={20} />
                      )}
                      <p>
                        {item.account_expanded?.provider === NewPaymentProvider.Stripe && '$'}
                        {item.formatted_total_amount}{' '}
                        {item.account_expanded?.provider !== NewPaymentProvider.Stripe && item.currency}
                      </p>
                    </div>
                    <div className="w-[96px]">
                      <Badge
                        color={match(item.state)
                          .with(NewPaymentState.Succeeded, () => 'var(--color-success-400)')
                          .with(NewPaymentState.Failed, () => 'var(--color-danger-400)')
                          .with(NewPaymentState.Refunded, () => 'var(--color-yellow-400)')
                          .otherwise(() => '')}
                      >
                        {item.state?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardTable.Row>
              );
            })}

            {!!dataListEventPayments?.listEventPayments.total &&
              dataListEventPayments?.listEventPayments.total > LIMIT && (
                <CardTable.Pagination
                  skip={skip}
                  limit={LIMIT}
                  total={dataListEventPayments?.listEventPayments.total}
                  onPrev={() => setSkip((prev) => prev - LIMIT)}
                  onNext={() => setSkip((prev) => prev + LIMIT)}
                />
              )}
          </CardTable.Root>
        </div>
      </div>
    </div>
  );
}

function CardItem({ icon, title, subtitle }: { icon: string; title: string | number; subtitle: string }) {
  return (
    <Card.Root className="flex-1 min-w-fit">
      <Card.Content className="px-3 py-2 flex gap-3 items-center">
        <div className="flex items-center justify-center rounded-sm p-2 bg-(--btn-tertiary)">
          <i className={clsx('text-tertiary size-[22px]', icon)} />
        </div>
        <div>
          <p>{title}</p>
          <p className="text-xs text-tertiary">{subtitle}</p>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
