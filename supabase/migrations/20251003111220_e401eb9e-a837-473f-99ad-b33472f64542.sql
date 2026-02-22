-- Create enum for vaccination status
CREATE TYPE vaccination_status AS ENUM ('completed', 'upcoming', 'overdue');

-- Create user profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  medical_history TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create preloaded vaccine schedules table
CREATE TABLE public.vaccine_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaccine_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'children', 'adult', 'covid', 'flu', etc.
  description TEXT,
  total_doses INTEGER DEFAULT 1,
  interval_days INTEGER, -- Days between doses
  age_group TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on vaccine_templates (public read)
ALTER TABLE public.vaccine_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vaccine templates"
  ON public.vaccine_templates FOR SELECT
  USING (is_active = true);

-- Create user vaccination records table
CREATE TABLE public.vaccination_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  dose_number INTEGER DEFAULT 1,
  total_doses INTEGER DEFAULT 1,
  date_taken DATE,
  next_due_date DATE,
  status vaccination_status DEFAULT 'upcoming',
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on vaccination_records
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;

-- Vaccination records policies
CREATE POLICY "Users can view own vaccination records"
  ON public.vaccination_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vaccination records"
  ON public.vaccination_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vaccination records"
  ON public.vaccination_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vaccination records"
  ON public.vaccination_records FOR DELETE
  USING (auth.uid() = user_id);

-- Create vaccination reminders table
CREATE TABLE public.vaccination_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaccination_record_id UUID NOT NULL REFERENCES public.vaccination_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  reminder_type TEXT NOT NULL, -- '3_days_before', '1_day_before', 'due_date'
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on vaccination_reminders
ALTER TABLE public.vaccination_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders"
  ON public.vaccination_reminders FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccination_records_updated_at
  BEFORE UPDATE ON public.vaccination_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update vaccination status
CREATE OR REPLACE FUNCTION update_vaccination_status()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vaccination_status
  BEFORE INSERT OR UPDATE ON public.vaccination_records
  FOR EACH ROW
  EXECUTE FUNCTION update_vaccination_status();

-- Insert common vaccine templates
INSERT INTO public.vaccine_templates (vaccine_name, category, description, total_doses, interval_days, age_group) VALUES
  ('BCG', 'children', 'Bacillus Calmette-Guérin vaccine for tuberculosis', 1, NULL, '0-1 years'),
  ('Hepatitis B', 'children', 'Hepatitis B vaccine', 3, 30, '0-1 years'),
  ('DPT', 'children', 'Diphtheria, Pertussis, and Tetanus vaccine', 3, 60, '0-5 years'),
  ('Polio (OPV)', 'children', 'Oral Polio Vaccine', 4, 60, '0-5 years'),
  ('MMR', 'children', 'Measles, Mumps, and Rubella vaccine', 2, 90, '1-5 years'),
  ('COVID-19 (Covishield)', 'covid', 'COVID-19 vaccine', 2, 84, 'All ages 18+'),
  ('COVID-19 (Covaxin)', 'covid', 'COVID-19 vaccine', 2, 28, 'All ages 18+'),
  ('Influenza', 'flu', 'Seasonal flu vaccine', 1, NULL, 'All ages'),
  ('Tetanus Booster', 'adult', 'Tetanus booster shot', 1, NULL, 'Adults'),
  ('HPV', 'adult', 'Human Papillomavirus vaccine', 2, 180, '9-26 years'),
  ('Pneumococcal', 'adult', 'Pneumococcal vaccine', 1, NULL, 'Adults 65+'),
  ('Varicella', 'children', 'Chickenpox vaccine', 2, 90, '1-12 years');