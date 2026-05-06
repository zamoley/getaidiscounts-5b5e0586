ALTER TABLE public.deal_votes ADD COLUMN IF NOT EXISTS voter_fingerprint text;
CREATE UNIQUE INDEX IF NOT EXISTS deal_votes_unique_fingerprint ON public.deal_votes (deal_id, voter_fingerprint) WHERE voter_fingerprint IS NOT NULL;
DROP POLICY IF EXISTS "anyone can vote" ON public.deal_votes;
CREATE POLICY "no public inserts of votes" ON public.deal_votes AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);