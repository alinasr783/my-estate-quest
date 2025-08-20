-- Create properties table with comprehensive structure
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL DEFAULT 'للبيع',
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area DECIMAL(10,2),
  
  -- Additional property features
  parking BOOLEAN DEFAULT false,
  balcony BOOLEAN DEFAULT false,
  garden BOOLEAN DEFAULT false,
  swimming_pool BOOLEAN DEFAULT false,
  gym BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  security BOOLEAN DEFAULT false,
  central_ac BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  
  -- Contact information
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  
  -- Images
  main_image TEXT,
  gallery_images TEXT[],
  
  -- Status and visibility
  status TEXT DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Create policies for admin insert/update/delete
CREATE POLICY "Admin can manage properties" 
ON public.properties 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id::text = auth.uid()::text
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.properties (title, description, price, location, property_type, listing_type, bedrooms, bathrooms, area, agent_name, agent_phone, main_image, parking, balcony, featured) VALUES
('شقة فاخرة في دبي مارينا', 'شقة حديثة مع إطلالة رائعة على البحر، تتميز بتصميم عصري وتشطيبات عالية الجودة', 2500000, 'دبي مارينا', 'شقة', 'للبيع', 3, 2, 150.5, 'أحمد محمد', '+971501234567', '/property-1.jpg', true, true, true),
('فيلا مستقلة في الإمارات هيلز', 'فيلا فاخرة مع حديقة خاصة ومسبح، في أرقى أحياء دبي', 8500000, 'الإمارات هيلز', 'فيلا', 'للبيع', 5, 4, 450.0, 'سارة أحمد', '+971502345678', '/property-2.jpg', true, false, true),
('شقة للإيجار في جميرا', 'شقة مفروشة بالكامل في موقع متميز قريب من الخدمات', 120000, 'جميرا', 'شقة', 'للإيجار', 2, 2, 110.0, 'خالد علي', '+971503456789', '/property-3.jpg', true, true, false),
('مكتب تجاري في مركز دبي المالي', 'مكتب بمساحة مفتوحة مع إطلالة على المدينة، مناسب للشركات', 180000, 'مركز دبي المالي', 'مكتب', 'للإيجار', 0, 2, 200.0, 'ناديا حسن', '+971504567890', '/property-4.jpg', true, false, true),
('بنتهاوس فاخر في برج خليفة', 'بنتهاوس استثنائي مع تراس واسع وإطلالة بانورامية على دبي', 15000000, 'وسط مدينة دبي', 'بنتهاوس', 'للبيع', 4, 3, 350.0, 'محمد الزهراني', '+971505678901', '/property-5.jpg', true, true, true);

-- Create property_visits table for analytics
CREATE TABLE IF NOT EXISTS public.property_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  visit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for property_visits
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;

-- Allow everyone to insert visits
CREATE POLICY "Anyone can log property visits"
ON public.property_visits
FOR INSERT
WITH CHECK (true);

-- Only admins can view visits
CREATE POLICY "Admins can view property visits"
ON public.property_visits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email'
  )
);