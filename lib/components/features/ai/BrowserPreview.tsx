'use client';
import React from 'react';

export default function BrowserPreview({
  initialUrl = 'https://localhost.staging.lemonade.social:8000/',
}: {
  initialUrl?: string;
}) {
  const [url, setUrl] = React.useState(initialUrl);

  return (
    <div className="flex-1 flex flex-col  border rounded-lg overflow-hidden shadow-lg">
      {/* Browser Header / Address Bar */}
      <div className="bg-gray-100 p-2 flex items-center gap-2 border-b">
        <div className="flex gap-1.5 px-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <input
          className="flex-1 px-3 py-1 text-sm border rounded bg-white"
          value={url}
          // onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* Browser Viewport */}
      <iframe src={url} className="flex-1 w-full border-none" title="Browser Window" />
    </div>
  );
}
