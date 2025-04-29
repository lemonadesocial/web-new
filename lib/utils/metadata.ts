
import { CID } from 'multiformats/cid';

export interface FetchableUrl {
  protocol: string;
  href: string;
}

export function getFetchableUrl(url: string): FetchableUrl {
  const { protocol, href } = new URL(url);
  switch (protocol) {
    case 'http:':
    case 'https:':
    case 'blob:':
    case 'data:':
      return { protocol, href };
    case 'ipfs:': {
      const [hostname, ...rest] = url.substring('ipfs://'.length).split('/');
      const cidv1 = CID.parse(hostname).toV1().toString();
      const pathname = rest.join('/');
      return {
        protocol,
        href: [process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL, cidv1, pathname].filter(Boolean).join('/'),
      };
    }
    default:
      throw new Error(`unsupported protocol ${protocol}`);
  }
}
