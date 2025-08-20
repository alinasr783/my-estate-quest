-- Create a data center table for managing site-wide information
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Public can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify site settings" 
ON public.site_settings 
FOR ALL 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default contact information
INSERT INTO public.site_settings (key, value) VALUES 
('contact_info', '{
  "company_name": "العقارات الذهبية",
  "phone": "+971501234567",
  "whatsapp": "+971501234567",
  "email": "info@goldenproperties.ae",
  "address": "دبي مارينا، الإمارات العربية المتحدة",
  "working_hours": "الأحد - الخميس: 9:00 ص - 6:00 م",
  "social_media": {
    "facebook": "https://facebook.com/goldenproperties",
    "instagram": "https://instagram.com/goldenproperties",
    "twitter": "https://twitter.com/goldenproperties",
    "linkedin": "https://linkedin.com/company/goldenproperties"
  }
}'),
('footer_info', '{
  "about_text": "العقارات الذهبية هي شركة رائدة في مجال العقارات في دولة الإمارات العربية المتحدة، نقدم خدمات متميزة في البيع والإيجار للعقارات السكنية والتجارية.",
  "services": [
    "بيع العقارات",
    "إيجار العقارات", 
    "استشارات عقارية",
    "إدارة الممتلكات",
    "تقييم العقارات"
  ],
  "quick_links": [
    {"title": "العقارات المميزة", "url": "/featured"},
    {"title": "للبيع", "url": "/properties?type=للبيع"},
    {"title": "للإيجار", "url": "/properties?type=للإيجار"},
    {"title": "اتصل بنا", "url": "/contact"}
  ]
}');

-- Add a users table to store user information for this app
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  phone text DEFAULT '',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (true);

-- Add trigger for timestamps on users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();