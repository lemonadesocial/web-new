import { useState } from 'react';
import clsx from 'clsx';
import * as _ from 'lodash';

import { modal, Avatar, FileInput, Button, Input, InputField } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { randomUserImage } from '$lib/utils/user';
import { Event } from '$lib/graphql/generated/backend/graphql';

import { AddInvitesModal } from './AddInvitesModal';
import { boolean } from 'zod';

export function InviteGuestsModal({
  event,
  title = 'Invite Guests',
  mode = 'invites',
}: {
  event: Event;
  title?: string;
  mode?: 'invites' | 'guests';
}) {
  const [emails, setEmails] = useState('');
  const [addedEmails, setAddedEmails] = useState<{ email: string; selected: boolean }[]>([]);
  const [selectedTab, setSelectedTab] = useState<'emails' | 'invites'>('emails');
  const [showFiter, setShowFilter] = useState(false);
  const [query, setQuery] = useState('');

  const extractValidEmails = (text: string) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return (text.match(emailRegex) || [])
      .map((e) => e.trim().toLowerCase())
      .filter((e, i, arr) => arr.indexOf(e) === i && !addedEmails.map((item) => item.email).includes(e))
      .map((item) => ({ email: item, selected: true }));
  };

  const mergedUnique = (arr1: Array<{email: string, selected: boolean}>, arr2: Array<{email: string, selected: boolean}>) => {
    const merged = _.merge(_.keyBy(arr1, 'email'), _.keyBy(arr2, 'email'))
    return _.values(merged)
  }

  const handleAddEmails = () => {
    const newEmails = extractValidEmails(emails);
    if (newEmails.length === 0) return;
    setAddedEmails(mergedUnique(addedEmails, newEmails));
    setEmails('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmails(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && extractValidEmails(emails).length > 0) {
      e.preventDefault();
      handleAddEmails();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    const valid = extractValidEmails(pasted);
    if (valid.length === 0) return;
    e.preventDefault();
    setAddedEmails((prev) => mergedUnique(prev, valid))
    setEmails('');
  };

  const handleToggleEmail = (email: string) => {
    setAddedEmails((prev) => prev.map((e) => {
      if(e.email === email) return {email: e.email, selected: !e.selected}
      return e
    }));
  };

  const handleCsvChange = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    parseEmailsFromCsv(file, (emails) => {
      const arr = emails.map(item => ({email: item, selected: true}))
      setAddedEmails((prev) => mergedUnique(prev, arr));
    });
  };

  const canAdd = extractValidEmails(emails).length > 0;
  const checkedCount = addedEmails.filter(item => item.selected).length;

  if (selectedTab === 'invites') {
    return (
      <AddInvitesModal
        event={event}
        title={title}
        emails={addedEmails.filter(item => item.selected).map(item => item.email)}
        show={mode}
        onBack={() => setSelectedTab('emails')}
      />
    );
  }

  return (
    <div className="w-sm md:w-[448px]">
      <div className="flex justify-between py-3 px-4 border-b">
        <p className="text-lg">{title}</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </div>

      {!showFiter ? (
        <div className="pt-4 px-4 space-y-1.5">
          <p className="text-sm">Add Emails</p>
          <div className="flex gap-2">
            <Input
              placeholder="Paste or enter emails here"
              value={emails}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className="flex-1"
              variant="outlined"
            />
            <Button variant="tertiary" onClick={handleAddEmails} disabled={!canAdd}>
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-4 px-4 [&_.control]:bg-(--btn-tertiary)! [&_.control]:border-none!">
          <InputField
            placeholder="Search Selected"
            iconLeft="icon-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {addedEmails.length > 0 && (
        <div className="flex flex-col pt-2 px-4 pb-4 max-h-[378px] overflow-y-auto no-scrollbar">
          {addedEmails.filter(item => query ? item.email.includes(query.toLowerCase()) : true).map(({email, selected}) => (
            <div
              key={email}
              className="flex items-center justify-between p-2 gap-3 cursor-pointer hover:bg-card-hover rounded-sm"
              onClick={() => handleToggleEmail(email)}
            >
              <Avatar size="lg" src={randomUserImage(email)} />
              <p className="truncate flex-1">{email}</p>
              <i className={clsx("size-5", selected ? 'icon-check-filled' : 'icon-circle-outline text-quaternary')} />
            </div>
          ))}
        </div>
      )}
      {!addedEmails.length && (
        <div className="mt-4 space-y-1.5 px-4 pb-4">
          <p className="text-sm">Import CSV</p>
          <FileInput accept=".csv" multiple={false} allowDrop={true} onChange={handleCsvChange}>
            {(open, isDragOver) => (
              <div
                className={clsx(
                  'flex flex-col items-center justify-center border border-dashed rounded-sm p-6 gap-4 cursor-pointer transition bg-card',
                  isDragOver && 'border-primary',
                )}
                onClick={open}
              >
                <i className="icon-csv size-6 text-tertiary" />
                <div>
                  <p className="text-center">Import CSV File</p>
                  <div className="text-sm text-tertiary text-center">Drop file or click here to choose file.</div>
                </div>
              </div>
            )}
          </FileInput>
          <div className="mt-4">
            <a
              href={`${ASSET_PREFIX}/assets/templates/invite-guests-template.csv`}
              className="text-sm text-tertiary flex items-center gap-1 hover:underline"
              download="invite-guests-template.csv"
            >
              <i className="icon-download size-4 text-tertiary" />
              Download CSV Template
            </a>
          </div>
        </div>
      )}
      <div className="flex justify-between py-3 px-4 border-t items-center">
        {checkedCount > 0 ? (
          <p
            className="text-tertiary hover:text-accent-400 cursor-pointer"
            onClick={() => {
              setQuery('')
              setShowFilter((prev) => !prev);
            }}
          >
            {checkedCount} selected
          </p>
        ) : (
          <div />
        )}
        <Button
          iconRight="icon-chevron-right"
          variant="secondary"
          onClick={() => setSelectedTab('invites')}
          disabled={checkedCount === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function parseEmailsFromCsv(file: File, callback: (emails: string[]) => void) {
  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target?.result as string;
    const lines = text.split(/\r?\n/);
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emails = lines.map((line) => line.trim()).filter((line) => emailRegex.test(line));
    callback(emails);
  };

  reader.readAsText(file);
}
