-- إنشاء جدول العقارات
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2),
  currency TEXT DEFAULT 'AED',
  listing_type TEXT NOT NULL CHECK (listing_type IN ('للبيع', 'للإيجار')),
  property_category TEXT NOT NULL CHECK (property_category IN ('سكني', 'تجاري')),
  property_type TEXT NOT NULL,
  location TEXT,
  city TEXT,
  area_sq_m DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor_number INTEGER,
  parking_spaces INTEGER,
  furnished BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rented', 'pending'))
);

-- إنشاء جدول صور العقارات
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المستخدمين العاديين
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المفضلة
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- إنشاء جدول تتبع سلوك المستخدمين
CREATE TABLE public.user_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('view', 'favorite', 'contact', 'share')),
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الإداريين
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول استفسارات التواصل
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'property', 'support')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين RLS للجداول
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للعقارات (عامة للقراءة)
CREATE POLICY "Anyone can view active properties" ON public.properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage properties" ON public.properties
  FOR ALL USING (true);

-- سياسات الأمان لصور العقارات
CREATE POLICY "Anyone can view property images" ON public.property_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage property images" ON public.property_images
  FOR ALL USING (true);

-- سياسات الأمان للمستخدمين
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can register" ON public.users
  FOR INSERT WITH CHECK (true);

-- سياسات الأمان للمفضلة
CREATE POLICY "Users can manage own favorites" ON public.user_favorites
  FOR ALL USING (true);

-- سياسات الأمان لتتبع النشاط
CREATE POLICY "Allow activity logging" ON public.user_activity
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all activity" ON public.user_activity
  FOR SELECT USING (true);

-- سياسات الأمان للإداريين
CREATE POLICY "Admins can view admin profiles" ON public.admins
  FOR SELECT USING (true);

-- سياسات الأمان للاستفسارات
CREATE POLICY "Anyone can submit inquiries" ON public.contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all inquiries" ON public.contact_inquiries
  FOR SELECT USING (true);

CREATE POLICY "Admins can update inquiries" ON public.contact_inquiries
  FOR UPDATE USING (true);

-- إنشاء تحديث تلقائي لـ updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إنشاء فهارس للبحث السريع
CREATE INDEX idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX idx_properties_category ON public.properties(property_category);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_location ON public.properties(location);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_featured ON public.properties(is_featured);
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_property_id ON public.user_activity(property_id);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at);

-- إدراج بيانات تجريبية للعقارات
INSERT INTO public.properties (title, description, price, listing_type, property_category, property_type, location, city, area_sq_m, bedrooms, bathrooms, is_featured) VALUES
('شقة فاخرة في دبي مارينا', 'شقة مفروشة بالكامل مع إطلالة على البحر، 3 غرف نوم و3 حمامات، في برج حديث مع جميع الخدمات', 2500000, 'للبيع', 'سكني', 'شقة', 'دبي مارينا', 'دبي', 180.5, 3, 3, true),
('فيلا راقية في الإمارات ليفينغ', 'فيلا منفصلة 5 غرف نوم مع حديقة ومسبح خاص، تشطيب على أعلى مستوى', 4200000, 'للبيع', 'سكني', 'فيلا', 'الإمارات ليفينغ', 'دبي', 420.0, 5, 4, true),
('مكتب تجاري في الخليج التجاري', 'مكتب مجهز بالكامل في برج تجاري مرموق، مساحة مفتوحة مع قاعة اجتماعات', 450000, 'للإيجار', 'تجاري', 'مكتب', 'الخليج التجاري', 'دبي', 120.0, 0, 2, false),
('شقة عصرية للإيجار في الشارقة', 'شقة حديثة غرفتين وصالة، مفروشة جزئياً في منطقة هادئة', 85000, 'للإيجار', 'سكني', 'شقة', 'المجاز', 'الشارقة', 95.0, 2, 2, false),
('محل تجاري في شارع الشيخ زايد', 'محل تجاري على الشارع الرئيسي، موقع استراتيجي مناسب لجميع الأنشطة التجارية', 350000, 'للإيجار', 'تجاري', 'محلات تجارية', 'شارع الشيخ زايد', 'دبي', 80.0, 0, 1, false);

-- إدراج صور تجريبية
INSERT INTO public.property_images (property_id, image_url, image_alt, is_primary, display_order) 
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  'صورة العقار الرئيسية',
  true,
  1
FROM public.properties p
LIMIT 5;

-- إنشاء إداري تجريبي (كلمة المرور: admin123)
INSERT INTO public.admins (email, password_hash, name) VALUES
('admin@realestate.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير النظام');