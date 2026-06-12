-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: patients
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Nullable for now, but good if we add auth later
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT NOT NULL,
    date_of_birth DATE,
    id_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: medical_aid_details
CREATE TABLE IF NOT EXISTS public.medical_aid_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    plan_name TEXT,
    medical_aid_number TEXT NOT NULL,
    main_member_name TEXT,
    main_member_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: patient_intake (AI Triage Results)
CREATE TABLE IF NOT EXISTS public.patient_intake (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE, -- Could be null if intake done anonymously first
    injury_type TEXT,
    onset TEXT,
    pain_scale INTEGER,
    clinical_summary TEXT,
    recommended_slot_duration INTEGER, -- in minutes (e.g., 30, 45, 60)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_type TEXT NOT NULL, -- e.g., 'Initial Assessment', 'Follow-up'
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) setup
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_aid_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Assuming patients log in via Supabase Auth and have role 'authenticated')
-- Admin roles would need separate policies (e.g., using a custom claim or a role table)

-- Patients policies
CREATE POLICY "Patients can view their own profile" ON public.patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Patients can update their own profile" ON public.patients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Patients can insert their own profile" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Medical Aid policies
CREATE POLICY "Patients can view their own medical aid details" ON public.medical_aid_details
    FOR SELECT USING (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

CREATE POLICY "Patients can manage their own medical aid details" ON public.medical_aid_details
    FOR ALL USING (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

-- Appointments policies
CREATE POLICY "Patients can view their own appointments" ON public.appointments
    FOR SELECT USING (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

CREATE POLICY "Patients can insert their own appointments" ON public.appointments
    FOR INSERT WITH CHECK (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

-- Patient Intake policies
CREATE POLICY "Patients can view their own intake records" ON public.patient_intake
    FOR SELECT USING (
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

CREATE POLICY "System can insert intake records" ON public.patient_intake
    FOR INSERT WITH CHECK (true); -- Usually restricted to a service role in Edge Functions

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_medical_aid_updated_at BEFORE UPDATE ON public.medical_aid_details FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
