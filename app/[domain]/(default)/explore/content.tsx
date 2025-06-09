'use client';
import React from 'react';
import { PageSection } from '../shared';
import { Divider } from '$lib/components/core';

export function Content() {
  return (
    <div className="flex flex-col gap-6">
      <PageSection title="Browse by Category">content Section</PageSection>
      <Divider className="my-2" />
      <PageSection title="Featured Community Hubs">content Section</PageSection>
      <Divider className="my-2" />
      <PageSection title="Explore Local Events">content Section</PageSection>
    </div>
  );
}
