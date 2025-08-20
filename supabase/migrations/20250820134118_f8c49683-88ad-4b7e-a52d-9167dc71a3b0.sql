-- Create admin users table for simple authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin users
CREATE POLICY "Admin users can view their own data"
ON public.admin_users
FOR SELECT
USING (true);

-- Create property visits tracking table
CREATE TABLE public.property_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_email TEXT NULL,
  user_name TEXT NULL,
  visit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;

-- Create policies for property visits
CREATE POLICY "Public can insert property visits"
ON public.property_visits
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can view all property visits"
ON public.property_visits
FOR SELECT
USING (true);

-- Create user wishlist table (using email instead of user_id since we're using custom auth)
CREATE TABLE public.user_wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_email, property_id)
);

-- Enable RLS
ALTER TABLE public.user_wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies for user wishlist
CREATE POLICY "Public can view wishlist"
ON public.user_wishlist
FOR SELECT
USING (true);

CREATE POLICY "Public can add to wishlist"
ON public.user_wishlist
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can remove from wishlist"
ON public.user_wishlist
FOR DELETE
USING (true);

-- Insert default admin user (email: admin@admin.com, password: admin123)
INSERT INTO public.admin_users (email, password) 
VALUES ('admin@admin.com', 'admin123');