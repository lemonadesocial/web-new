import { Collection, MongoClient, Document } from 'mongodb';

let mongoClient: MongoClient | undefined;

export async function get(): Promise<MongoClient> {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.DATABASE_URL as string);

    await mongoClient.connect();
  }

  return mongoClient;
}

export async function collection<TSchema extends Document>(name: string, database?: string): Promise<Collection<TSchema>> {
  const client = await get();

  return client.db(database).collection<TSchema>(name);
}
