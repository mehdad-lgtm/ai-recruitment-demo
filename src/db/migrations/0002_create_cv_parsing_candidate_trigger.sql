-- Create trigger to auto-create candidate from cv_parsing_results
-- This trigger runs BEFORE INSERT on cv_parsing_results.
-- If the inserted row has no candidate_id, it will:
-- 1) try to find an existing candidate by phone
-- 2) otherwise insert a new candidate with available extracted data
-- 3) set the new cv_parsing_results.candidate_id to the found/created candidate id

CREATE OR REPLACE FUNCTION public.create_candidate_from_cv_parsing_results()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_phone text;
  v_email text;
  v_name text;
  v_candidate_id uuid;
BEGIN
  -- If candidate already linked, do nothing
  IF NEW.candidate_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Extract common fields from JSONB extracted_data
  v_phone := NULLIF((NEW.extracted_data ->> 'phone')::text, '');
  v_email := NULLIF((NEW.extracted_data ->> 'email')::text, '');
  v_name := NULLIF((NEW.extracted_data ->> 'name')::text, '');

  -- If phone present, try to find existing candidate
  IF v_phone IS NOT NULL THEN
    SELECT id INTO v_candidate_id FROM public.candidates WHERE phone = v_phone LIMIT 1;
  END IF;

  -- If no existing candidate found, insert a new one
  IF v_candidate_id IS NULL THEN
    INSERT INTO public.candidates (phone, email, name, source, cv_url, cv_parsed_at)
    VALUES (v_phone, v_email, v_name, 'cv_upload', NEW.source_url, COALESCE(NEW.processed_at, now()))
    RETURNING id INTO v_candidate_id;
  END IF;

  -- Link the cv_parsing_results row to the candidate
  NEW.candidate_id := v_candidate_id;

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trg_create_candidate_from_cv_parsing_results ON public.cv_parsing_results;
CREATE TRIGGER trg_create_candidate_from_cv_parsing_results
BEFORE INSERT ON public.cv_parsing_results
FOR EACH ROW
EXECUTE FUNCTION public.create_candidate_from_cv_parsing_results();
