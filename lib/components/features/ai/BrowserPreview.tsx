'use client';
import { windowPane } from '$lib/components/core/dialog/window-panes';
import React from 'react';

export default function BrowserPreview({ url }: { url?: string }) {
  const src = 'https://staging.lemonade.social/' + (url || '');
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden shadow-lg">
      <div className="p-2 flex items-center gap-2 border-b">
        <div className="flex gap-1.5 px-2">
          <div className="w-3 h-3 rounded-full bg-red-400" onClick={() => windowPane.close()} />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <input className="flex-1 px-3 py-1 text-sm border rounded" value={src} readOnly />
      </div>

      {/* Browser Viewport */}
      <div className="flex-1">Should show content here</div>
    </div>
  );
}
