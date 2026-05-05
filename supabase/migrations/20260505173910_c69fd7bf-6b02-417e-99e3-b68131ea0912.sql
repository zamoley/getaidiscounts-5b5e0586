CREATE TABLE public.deal_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id text NOT NULL,
  vote text NOT NULL CHECK (vote IN ('worked','broken')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_deal_votes_deal_id ON public.deal_votes(deal_id);

ALTER TABLE public.deal_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can vote"
ON public.deal_votes
FOR INSERT
TO anon, authenticated
WITH CHECK (char_length(deal_id) BETWEEN 1 AND 120 AND vote IN ('worked','broken'));

CREATE POLICY "anyone can read vote totals"
ON public.deal_votes
FOR SELECT
TO anon, authenticated
USING (true);