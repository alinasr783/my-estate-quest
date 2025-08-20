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
  user_id UUID NULL, -- Can be null for non-authenticated users
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

-- Create user wishlist table
CREATE TABLE public.user_wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.user_wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies for user wishlist
CREATE POLICY "Users can view their own wishlist"
ON public.user_wishlist
FOR SELECT
USING (true); -- We'll handle auth in the application layer

CREATE POLICY "Users can add to their own wishlist"
ON public.user_wishlist
FOR INSERT
WITH CHECK (true); -- We'll handle auth in the application layer

CREATE POLICY "Users can remove from their own wishlist"
ON public.user_wishlist
FOR DELETE
USING (true); -- We'll handle auth in the application layer

-- Insert default admin user (email: admin@admin.com, password: admin123)
INSERT INTO public.admin_users (email, password) 
VALUES ('admin@admin.com', 'admin123');