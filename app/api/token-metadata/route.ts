import { NextResponse, type NextRequest } from "next/server";
import { PinataSDK } from "pinata";
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.LAUNCHPAD_PINATA_JWT) {
      return NextResponse.json(
        { error: "LAUNCHPAD_PINATA_JWT is not set" },
        { status: 500 }
      );
    }
    
    const pinata = new PinataSDK({
      pinataJwt: process.env.LAUNCHPAD_PINATA_JWT,
    });
    
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const coinName = data.get("coinName") as string;
    const ticker = data.get("ticker") as string;
    const description = data.get("description") as string;
    const attributesJson = data.get("attributes") as string;

    if (!file || !coinName || !ticker || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { cid: imageCid } = await pinata.upload.public.file(file);
    const imageUrl = await pinata.gateways.public.convert(imageCid);

    const metadata: any = {
      name: coinName,
      symbol: ticker,
      description: description,
      image: `ipfs://${imageCid}`
    };

    if (attributesJson) {
      try {
        const attributes = JSON.parse(attributesJson);
        if (Array.isArray(attributes) && attributes.length > 0) {
          metadata.attributes = attributes;
        }
      } catch (e) {
        Sentry.captureException(e);
      }
    }

    const metadataJson = JSON.stringify(metadata, null, 2);
    const metadataBlob = new Blob([metadataJson], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });

    const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);
    const tokenUri = `ipfs://${metadataCid}`;

    return NextResponse.json({ 
      tokenUri,
      imageUrl,
      metadata 
    }, { status: 200 });

  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
