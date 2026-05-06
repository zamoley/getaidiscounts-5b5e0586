-- Explicit restrictive SELECT policies to document deny-all intent
CREATE POLICY "no public reads of deal requests"
ON public.deal_requests
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "no public reads of newsletter subscribers"
ON public.newsletter_subscribers
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);