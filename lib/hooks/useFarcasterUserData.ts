import { useQuery } from '@tanstack/react-query';

export interface FarcasterUserData {
  username?: string;
  fid?: string;
  display_name?: string;
  avatar?: string;
  bio?: string;
}

async function fetchFarcasterUserData(fid: string): Promise<FarcasterUserData> {
  const response = await fetch(`https://hub.pinata.cloud/v1/userDataByFid?fid=${fid}`);
  const data = await response.json();

  const userData: FarcasterUserData = data.messages.reduce((acc: FarcasterUserData, message: any) => {
    const { type, value } = message.data.userDataBody;
    if (type === 'USER_DATA_TYPE_USERNAME') {
      acc.username = value;
      acc.fid = message.data.fid;
    } else if (type === 'USER_DATA_TYPE_DISPLAY') {
      acc.display_name = value;
    } else if (type === 'USER_DATA_TYPE_PFP') {
      acc.avatar = value;
    } else if (type === 'USER_DATA_TYPE_BIO') {
      acc.bio = value;
    }
    return acc;
  }, {});

  return userData;
}

export function useFarcasterUserData(fid?: string | null) {
  const { data: userData, isLoading: loading, error } = useQuery({
    queryKey: ['farcaster-user-data', fid],
    queryFn: () => fetchFarcasterUserData(fid as string),
    enabled: !!fid,
  });

  return {
    userData,
    loading,
    error,
  };
}

