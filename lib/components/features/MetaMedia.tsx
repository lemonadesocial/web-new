import { getFetchableUrl } from "$lib/utils/metadata";

export interface NFTMetadata {
  name?: string;
  image?: string;
  image_data?: string;
  animation_url?: string;
  youtube_url?: string;
  [key: string]: any;
}

export interface MetaMediaProps {
  metadata: NFTMetadata;
  className?: string;
}

export function MetaMedia({ metadata, className }: MetaMediaProps) {
  const { name, image, image_data, animation_url, youtube_url } = metadata;
  const imageUrl = image ? getFetchableUrl(image).href : undefined;
  const animUrl = animation_url ? getFetchableUrl(animation_url).href : undefined;

  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/.*v=)([^&#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (animUrl) {
    const isVideo = /\.(mp4|webm|ogg|m4v|ogv)$/i.test(animUrl);
    if (isVideo) {
      const ext = animUrl.split('.').pop() || '';
      return (
        <video controls loop muted poster={imageUrl} className={className}>
          <source src={animUrl} type={`video/${ext}`} />
          Your browser does not support HTML5 video.
        </video>
      );
    }
    return (
      <iframe
        src={animUrl}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={name || 'NFT animation'}
        className={className}
      />
    );
  }

  if (youtube_url) {
    const embedUrl = getYouTubeEmbedUrl(youtube_url);
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={name || 'YouTube video'}
          className={className}
        />
      );
    }
  }

  if (image_data) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: image_data }} />;
  }

  if (imageUrl) {
    return <img src={imageUrl} alt={name || 'NFT image'} className={className} />;
  }

  return null;
}
