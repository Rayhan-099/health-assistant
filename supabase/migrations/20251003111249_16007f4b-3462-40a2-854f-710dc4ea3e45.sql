-- Fix security warnings by setting search_path on functions

-- Drop and recreate update_updated_at_column with search_path
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccination_records_updated_at
  BEFORE UPDATE ON public.vaccination_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop and recreate update_vaccination_status with search_path
DROP FUNCTION IF EXISTS update_vaccination_status CASCADE;
CREATE OR REPLACE FUNCTION update_vaccination_status()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.next_due_date IS NOT NULL THEN
    IF NEW.next_due_date < CURRENT_DATE THEN
      NEW.status = 'overdue';
    ELSIF NEW.date_taken IS NOT NULL THEN
      NEW.status = 'completed';
    ELSE
      NEW.status = 'upcoming';
    END IF;
  ELSIF NEW.date_taken IS NOT NULL THEN
    NEW.status = 'completed';
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger for vaccination status
CREATE TRIGGER set_vaccination_status
  BEFORE INSERT OR UPDATE ON public.vaccination_records
  FOR EACH ROW
  EXECUTE FUNCTION update_vaccination_status();