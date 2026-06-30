-- SNRLED Database Schema
-- Run this in Supabase SQL Editor

-- Enums
CREATE TYPE gender_type AS ENUM ('stag', 'doe');
CREATE TYPE pricing_phase_type AS ENUM ('early_bird', 'phase1', 'phase2', 'walkin');
CREATE TYPE payment_status_type AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE verification_status_type AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE admin_role_type AS ENUM ('owner', 'admin', 'moderator');

-- Event Settings (single active record)
CREATE TABLE event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL DEFAULT 'SNRLED',
  tagline TEXT DEFAULT 'If you know, you know.',
  description TEXT DEFAULT 'The city''s most exclusive pool experience.',
  event_date DATE DEFAULT '2026-07-17',
  event_time TEXT DEFAULT '18:00',
  countdown_date TIMESTAMPTZ DEFAULT '2026-07-17T18:00:00+05:30',
  city TEXT DEFAULT 'Coimbatore',
  registration_limit INTEGER DEFAULT 200,
  phase_switch_limit INTEGER DEFAULT 60,
  current_phase pricing_phase_type DEFAULT 'phase1',
  current_registration_count INTEGER DEFAULT 0,
  max_people_per_registration INTEGER DEFAULT 5,
  early_bird_stag INTEGER DEFAULT 1500,
  early_bird_doe INTEGER DEFAULT 1000,
  phase1_stag INTEGER DEFAULT 1900,
  phase1_doe INTEGER DEFAULT 1400,
  phase2_stag INTEGER DEFAULT 2400,
  phase2_doe INTEGER DEFAULT 1900,
  walkin_stag INTEGER DEFAULT 3000,
  walkin_doe INTEGER DEFAULT 2000,
  venue_hidden BOOLEAN DEFAULT true,
  venue_address TEXT DEFAULT 'Venue details revealed after confirmation',
  google_maps TEXT DEFAULT '#',
  upi_placeholder TEXT DEFAULT 'snrled@upi',
  qr_image TEXT DEFAULT '/placeholders/qr-placeholder.svg',
  logo_url TEXT DEFAULT '/branding/logo.jpg',
  hero_image_url TEXT DEFAULT '/gallery/snrled-party-05.jpeg',
  instagram_url TEXT DEFAULT 'https://instagram.com/snrled',
  registration_open BOOLEAN DEFAULT true,
  event_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  instagram TEXT NOT NULL,
  gender gender_type NOT NULL,
  people_count INTEGER NOT NULL DEFAULT 1,
  pricing_phase pricing_phase_type NOT NULL,
  amount INTEGER NOT NULL,
  payment_status payment_status_type DEFAULT 'pending',
  verification_status verification_status_type DEFAULT 'pending',
  verification_notes TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_registrations_phone ON registrations(phone);
CREATE INDEX idx_registrations_instagram ON registrations(instagram);
CREATE INDEX idx_registrations_registration_id ON registrations(registration_id);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX idx_registrations_verification_status ON registrations(verification_status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);

-- Gallery Images
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  title TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role admin_role_type DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registration ID sequence
CREATE SEQUENCE registration_id_seq START 1;

-- Function to generate registration ID
CREATE OR REPLACE FUNCTION generate_registration_id()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  next_num := nextval('registration_id_seq');
  RETURN 'SNRLED-' || LPAD(next_num::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Auto-update phase when count reaches limit
CREATE OR REPLACE FUNCTION update_phase_on_registration()
RETURNS TRIGGER AS $$
DECLARE
  settings RECORD;
  new_count INTEGER;
BEGIN
  SELECT * INTO settings FROM event_settings WHERE event_active = true LIMIT 1;
  IF settings IS NULL THEN RETURN NEW; END IF;

  new_count := settings.current_registration_count + 1;

  UPDATE event_settings
  SET
    current_registration_count = new_count,
    current_phase = CASE
      WHEN new_count >= settings.phase_switch_limit THEN 'phase2'::pricing_phase_type
      ELSE 'phase1'::pricing_phase_type
    END,
    updated_at = NOW()
  WHERE event_active = true;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_phase
AFTER INSERT ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_phase_on_registration();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_registrations_updated
BEFORE UPDATE ON registrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_event_settings_updated
BEFORE UPDATE ON event_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default event settings
INSERT INTO event_settings (
  event_name,
  hero_image_url
) VALUES (
  'SNRLED',
  '/gallery/snrled-party-05.jpeg'
);

INSERT INTO gallery_images (image_url, display_order, title) VALUES
  ('/gallery/snrled-party-05.jpeg', 1, 'Pool access'),
  ('/gallery/snrled-party-01.jpeg', 2, 'Crowd energy'),
  ('/gallery/snrled-party-02.jpeg', 3, 'Night floor'),
  ('/gallery/snrled-party-03.jpeg', 4, 'Private room'),
  ('/gallery/snrled-party-04.jpeg', 5, 'After hours');

-- RLS Policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Public can read event settings and gallery.
CREATE POLICY "Public read event settings" ON event_settings
  FOR SELECT TO anon, authenticated USING (event_active = true);

CREATE POLICY "Public read gallery" ON gallery_images
  FOR SELECT TO anon, authenticated USING (active = true);

-- Service role handles private data and writes via API routes.
CREATE POLICY "Service role all registrations" ON registrations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role all event settings" ON event_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role all gallery" ON gallery_images
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role all admin users" ON admin_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role all activity logs" ON activity_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Storage buckets (create via Supabase dashboard or API):
-- payment-proofs (private)
-- branding (public)
-- gallery (public)
-- exports (private)
