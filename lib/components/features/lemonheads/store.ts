import { atom } from 'jotai';

export const mintAtom = atom({ minted: false, video: false, mute: true, image: '', txHash: '', tokenId: '' });
