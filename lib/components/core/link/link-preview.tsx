import React from 'react';
import { trpc } from '$lib/trpc/client';
import { Skeleton } from '../skeleton';

type PreviewData = {
  videoId?: string;
  videoThumbnail?: string;
  title?: string;
  description?: string;
  image?: string;
};

export function LinkPreview({ url }: { url: string }) {
  const [data, setData] = React.useState<PreviewData | null>(null);

  function isValidUrl(str: string) {
    const reg = /^(http|https):\/\/([a-z]*\.)?[a-z]*\.[a-z]{2,}(\/)?$/;
    return reg.test(str);
  }

  const isYouTubeURL = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const extractYouTubeVideoId = (url: string) => {
    const videoIdRegex = /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : '';
  };

  const handleClick = () => {
    window.open(url, '_blank');
  };

  const { data: extractUrlData, isLoading } = trpc.openGraph.extractUrl.useQuery({ url });

  React.useEffect(() => {
    if (extractUrlData?.html && url) {
      const content = extractUrlData.html;

      const isYouTubeVideo = isYouTubeURL(url);
      if (isYouTubeVideo) {
        const videoId = extractYouTubeVideoId(url);
        const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        setData({ videoId, videoThumbnail });
      } else {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const title = doc.querySelector('title')?.textContent || '';
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        setData({ title, description, image });
      }
    }
  }, [extractUrlData, url]);

  React.useEffect(() => {
    if (isLoading) {
      setData(null);
    }
  }, [isLoading]);

  if (isLoading && isValidUrl(url)) {
    return <Skeleton className="h-16 w-full" animate />;
  }

  if (!data) return null;

  if (data.videoId) {
    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src={data.videoThumbnail} alt="Video Thumbnail" />
      </div>
    );
  }

  if (data.title || data.description || data.image)
    return (
      <div onClick={handleClick} className="flex flex-col gap-2" style={{ cursor: 'pointer' }}>
        {data?.title && <h3 className="font-medium">{data.title}</h3>}
        {data?.description && <p className="text-sm">{data.description}</p>}
        {data?.image && <img src={data.image} alt={url} className="rounded-md" />}
      </div>
    );

  return null;
}
