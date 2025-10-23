import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "../../../lib/utils/pinata";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const coinName = data.get("coinName") as string;
    const ticker = data.get("ticker") as string;
    const description = data.get("description") as string;

    if (!file || !coinName || !ticker || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { cid: imageCid } = await pinata.upload.public.file(file);
    const imageUrl = await pinata.gateways.public.convert(imageCid);

    const metadata = {
      name: coinName,
      symbol: ticker,
      description: description,
      image: `ipfs://${imageCid}`
    };

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
    console.error('Error creating token metadata:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
