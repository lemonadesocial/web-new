import axios from 'axios';
import React from 'react';
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
  const [loading, setLoading] = React.useState(true);

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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/og/extractor', {
          params: { url },
        });
        const data = res.data?.html;

        const isYouTubeVideo = isYouTubeURL(url);
        if (isYouTubeVideo) {
          const videoId = extractYouTubeVideoId(url);
          const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          setData({
            videoId,
            videoThumbnail,
          });
          setLoading(false);
        } else {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          const title = doc.querySelector('title')?.textContent || '';
          const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

          setData({
            title,
            description,
            image,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
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
