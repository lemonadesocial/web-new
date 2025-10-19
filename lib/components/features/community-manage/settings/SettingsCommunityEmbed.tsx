'use client';
import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/onedark.css';
import { Card } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';

const code = `<iframe 
    src="https://lemonade.social/embed/s/SPACE_ID" 
    width="624" 
    height="480" 
    allowfullscreen 
    aria-hidden="false" 
    tabindex="0" 
    frameborder="0">
</iframe>
`;

export function SettingsCommunityEmbed({ space }: { space: Space }) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    hljs.configure({
      languages: ['html'],
    });
    hljs.initHighlighting();
  }, []);

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex-1">Embed Events</h3>
          </div>
          <p className="text-secondary">
            Have your own site? Embed your calendar to easily share a live view of your upcoming events.
          </p>
        </div>
      </div>

      <Card.Root>
        <Card.Content>
          {loading && (
            <div className="flex justify-center items-center text-tertiary h-full">
              <p>Preparing ...</p>
            </div>
          )}
          <iframe
            onLoad={() => setLoading(false)}
            loading="lazy"
            style={{ border: 'none' }}
            src={`/embed/s/${space._id}`}
            className="w-full block"
            height={480}
            allowFullScreen
            aria-hidden="false"
            tabIndex={0}
          ></iframe>
        </Card.Content>
      </Card.Root>

      <div className="space-y-1.5">
        <p className="font-title text-sm">Code to Copy</p>
        <Card.Root>
          <Card.Content>
            <pre className="p-0 m-0">
              <code className="language-html" style={{ background: 'transparent', whiteSpace: 'pre', padding: 0 }}>
                {code.replace('SPACE_ID', space._id)}
              </code>
            </pre>
          </Card.Content>
        </Card.Root>
        <p className="text-sm text-tertiary">
          You can change the width and height attributes above to fit the size of your page.
        </p>
      </div>
    </div>
  );
}
