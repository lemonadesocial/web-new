'use client';

import { DaimoPayButton } from "@daimo/pay";
import { ethers } from "ethers";
import { encodeFunctionData, parseAbi, zeroAddress } from "viem";
import {
  arbitrum,

} from "@daimo/pay-common";

import LemonheadNFT from '$lib/abis/LemonheadNFT.json';


export default function DaimoPage() {
  const mintData = { look: '0x1f410bd217373a2d849248739383cb3d3d829f1a95b5799ba687f309a1003e75', signature: '0xce5d0f651ebdc5a90b37fc119b8e8bc541b58c0c843efd2c…f75cf87c7b787de839c70c5341e7925bb7d4c0f4406d1e51c', image: 'https://api.grove.storage/47aceaeb0cd4dc673478c84be48a76a14ac131ac4b8fcd35010b5c0f04fc30a1', metadata: '294eb59c4ff9155e2acdc913eac584187d3e67aad3cbc86640110e9b00a589f8' }

  const encodeData = encodeFunctionData({
    abi: LemonheadNFT.abi,
    functionName: "mint",
    args: [mintData.look, mintData.metadata, mintData.signature],
  })

  console.log(encodeData)

  return <div>
    <DaimoPayButton
      appId="pay-demo"
      toAddress="0x2b2c5Bf620f47FB1ebe940Db8C943E5c76771e46"
      toChain={11155111}
      toUnits="0.01337"
      toToken={ethers.ZeroAddress as `0x${string}`}

      intent="Purchase NFT"
      toCallData={encodeData}

      onPaymentStarted={(e) => console.log(e)}
      onPaymentCompleted={(e) => console.log(e)}
      onPaymentBounced={(e) => console.log(e)}
    />
  </div>;
}
