'use client';
import React from 'react';
import clsx from 'clsx';

import { Button, drawer, toast, Card, Skeleton } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { ListDocumentsDocument, type Document } from '$lib/graphql/generated/ai/graphql';
import { useQuery } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';

interface Props {
  currentDocumentIds: string[];
  onSelected: (document: Pick<Document, '_id' | 'title' | 'text'>) => void;
}

export function SelectExistingKnowledgeBasePane({ currentDocumentIds, onSelected }: Props) {
  const [selectedDocumentIds, setSelectedDocumentIds] = React.useState<string[]>([]);

  const { data, loading } = useQuery(
    ListDocumentsDocument,
    {},
    aiChatClient,
  );

  const allDocuments = data?.listDocuments?.items ?? [];

  const availableDocuments = React.useMemo(() => {
    return allDocuments
      .filter((doc) => !currentDocumentIds.includes(doc._id))
      .map((doc) => ({ _id: doc._id, title: doc.title, text: doc.text }));
  }, [allDocuments, currentDocumentIds]);

  const handleToggleDocument = (documentId: string) => {
    setSelectedDocumentIds((prev) => {
      if (prev.includes(documentId)) {
        return prev.filter((id) => id !== documentId);
      }
      return [...prev, documentId];
    });
  };

  const handleAddDocuments = () => {
    if (selectedDocumentIds.length === 0) {
      toast.error('Please select at least one knowledge base');
      return;
    }

    const documentsToAdd = availableDocuments.filter((doc) =>
      selectedDocumentIds.includes(doc._id)
    );

    if (documentsToAdd.length !== selectedDocumentIds.length) {
      toast.error('Some selected knowledge bases were not found');
      return;
    }

    documentsToAdd.forEach((document) => {
      onSelected(document);
    });

    drawer.close();
    toast.success(
      documentsToAdd.length === 1
        ? 'Knowledge base added'
        : `${documentsToAdd.length} knowledge bases added`
    );
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>

      <Pane.Content className="p-4 flex flex-col gap-4 overflow-auto">
        <div>
          <h3 className="text-xl font-semibold">Existing Knowledge Bases</h3>
          <p className="text-secondary">
            Select one or more knowledge bases that already exist.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-card">
                <Skeleton className="size-7 rounded-sm shrink-0" animate />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <Skeleton className="h-5 w-32" animate />
                  <Skeleton className="h-4 w-48" animate />
                </div>
                <Skeleton className="size-5 rounded-full shrink-0" animate />
              </div>
            ))}
          </div>
        ) : availableDocuments.length === 0 ? (
          <Card.Root>
            <div className="p-4 flex gap-3 items-center">
              <i aria-hidden="true" className="icon-book size-9 aspect-square text-quaternary" />
              <div className="text-tertiary space-y-0.5">
                <p>No Knowledge Bases Available</p>
                <p className="text-sm">All available knowledge bases are already added.</p>
              </div>
            </div>
          </Card.Root>
        ) : (
          <div className="flex flex-col gap-2">
            {availableDocuments.map((doc) => (
              <div
                key={doc._id}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-md bg-card hover:bg-card/80 transition-colors cursor-pointer border',
                  selectedDocumentIds.includes(doc._id) ? 'border-primary' : 'border-transparent'
                )}
                onClick={() => handleToggleDocument(doc._id)}
              >
                <div className="size-7 rounded-sm flex items-center justify-center bg-card">
                  <i aria-hidden="true" className="icon-book size-4 text-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{doc.title || 'Untitled'}</p>
                  <p className="text-sm text-tertiary line-clamp-1 mt-0.5">
                    {doc.text}
                  </p>
                </div>
                <div className="relative flex items-center justify-center shrink-0">
                  {selectedDocumentIds.includes(doc._id) ? (
                    <i aria-hidden="true" className="icon-check size-5 text-primary" />
                  ) : (
                    <i aria-hidden="true" className="icon-circle-outline size-5 text-quaternary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button
            variant="secondary"
            onClick={handleAddDocuments}
            disabled={selectedDocumentIds.length === 0}
          >
            Add Knowledge Base
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}
