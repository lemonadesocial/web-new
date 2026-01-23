import { createClient } from '@supabase/supabase-js';

const apiKey = process.env.SUPABASE_API_KEY;
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const tableName = process.env.SUPABASE_RED_ENVELOPE_TABLE || "";

export type RedEnvelope = {
  id: number;
  created_at: string;
  owner_user: string;
  token_id: number;
  currency: string | null;
  amount: number | null;
  message: string | null;
  recipient_wallet: string | null;
};

export type RedEnvelopeInput = Omit<RedEnvelope, 'id' | 'created_at' | 'owner_user'>;

const getSupabaseClient = () => {
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL');
  }

  if (!apiKey) {
    throw new Error('Missing SUPABASE_API_KEY');
  }

  return createClient(supabaseUrl, apiKey, {
    auth: { persistSession: false },
  });
};

export const getRedEnvelopesByOwnerUser = async (ownerUser: string): Promise<RedEnvelope[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('owner_user', ownerUser)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const upsertRedEnvelopes = async (ownerUser: string, envelopes: RedEnvelopeInput[]): Promise<RedEnvelope[]> => {
  if (envelopes.length === 0) {
    return [];
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableName)
    .upsert(
      envelopes.map((e) => ({ ...e, owner_user: ownerUser })),
      {
        onConflict: 'owner_user,token_id',
      },
    )
    .select('*');

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const deleteRedEnvelopesByTokenIds = async (ownerUser: string, tokens: number[]): Promise<number> => {
  if (tokens.length === 0) {
    return 0;
  }

  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from(tableName)
    .delete({ count: 'exact' })
    .eq('owner_user', ownerUser)
    .in('token_id', tokens);

  if (error) {
    throw error;
  }

  return count ?? 0;
};
