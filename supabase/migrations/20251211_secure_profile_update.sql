-- Enable pgsodium extension for cryptographic functions if available
-- Note: Requires Supabase project setting enabled.
create extension if not exists pgsodium;

-- Create secure update function
create or replace function update_profile_secure(
  p_wallet_address text,
  p_timestamp bigint,
  p_signature text, -- Hex encoded signature
  p_public_key_hex text, -- Hex encoded public key
  p_display_name text default null,
  p_message text default null,
  p_link text default null
) returns void as $$
declare
  v_message text;
  v_valid boolean;
  v_signature_bytes bytea;
  v_pubkey_bytes bytea;
  v_message_bytes bytea;
begin
  -- 1. Construct the expected message
  -- Must match createLoginMessage in signature.ts exactly:
  -- "Login to SpendThrone.com\nWallet: <wallet>\nTimestamp: <timestamp>"
  v_message := 'Login to SpendThrone.com' || chr(10) || 'Wallet: ' || p_wallet_address || chr(10) || 'Timestamp: ' || p_timestamp::text;
  v_message_bytes := convert_to(v_message, 'UTF8');
  
  -- 2. Validate Timestamp (Optional: prevent replay attacks > 10 minutes old)
  -- Allow some clock skew
  if (extract(epoch from now()) * 1000)::bigint - p_timestamp > 600000 then
     -- raise exception 'Signature expired';
     -- Warn only for now
  end if;

  -- 3. Decode Hex inputs to Bytea
  v_signature_bytes := decode(p_signature, 'hex');
  v_pubkey_bytes := decode(p_public_key_hex, 'hex');

  -- 4. Verify Signature using pgsodium
  v_valid := pgsodium.crypto_sign_verify_detached(
    v_signature_bytes,
    v_message_bytes,
    v_pubkey_bytes
  );

  if not v_valid then
    raise exception 'Invalid signature';
  end if;

  -- 5. Perform Upsert
  insert into public.leaderboard (
    wallet_address,
    display_name,
    message,
    link,
    updated_at
  ) values (
    p_wallet_address,
    coalesce(p_display_name, 'Unknown'),
    p_message,
    p_link,
    now()
  )
  on conflict (wallet_address) do update set
    display_name = coalesce(p_display_name, leaderboard.display_name),
    message = coalesce(p_message, leaderboard.message),
    link = coalesce(p_link, leaderboard.link),
    updated_at = now();
    
end;
$$ language plpgsql security definer;
