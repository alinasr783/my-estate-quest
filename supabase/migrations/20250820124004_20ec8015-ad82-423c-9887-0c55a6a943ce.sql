-- Add more property details columns
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS parking INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS balcony INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS furnished BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS elevator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS garden BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pool BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS security BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gym BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS floor_number INTEGER,
ADD COLUMN IF NOT EXISTS total_floors INTEGER,
ADD COLUMN IF NOT EXISTS year_built INTEGER,
ADD COLUMN IF NOT EXISTS agent_name TEXT,
ADD COLUMN IF NOT EXISTS agent_phone TEXT,
ADD COLUMN IF NOT EXISTS agent_whatsapp TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS nearby_places TEXT[];

-- Update existing properties with sample data
UPDATE public.properties 
SET 
  parking = (RANDOM() * 3)::INTEGER + 1,
  balcony = (RANDOM() * 2)::INTEGER,
  furnished = RANDOM() > 0.5,
  elevator = RANDOM() > 0.6,
  garden = RANDOM() > 0.3,
  pool = RANDOM() > 0.2,
  security = RANDOM() > 0.7,
  gym = RANDOM() > 0.4,
  latitude = 30.0444 + (RANDOM() - 0.5) * 0.1,
  longitude = 31.2357 + (RANDOM() - 0.5) * 0.1,
  floor_number = (RANDOM() * 10)::INTEGER + 1,
  total_floors = (RANDOM() * 15)::INTEGER + 5,
  year_built = 2000 + (RANDOM() * 24)::INTEGER,
  agent_name = CASE 
    WHEN RANDOM() < 0.25 THEN 'أحمد محمد'
    WHEN RANDOM() < 0.5 THEN 'سارة أحمد'
    WHEN RANDOM() < 0.75 THEN 'محمد علي'
    ELSE 'فاطمة حسن'
  END,
  agent_phone = '+201' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
  agent_whatsapp = '+201' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
  features = CASE 
    WHEN RANDOM() < 0.5 THEN ARRAY['مطبخ مجهز', 'تكييف مركزي', 'إنترنت عالي السرعة']
    ELSE ARRAY['شرفة واسعة', 'إطلالة على البحر', 'قريب من المترو', 'مدخل خاص']
  END,
  nearby_places = CASE 
    WHEN RANDOM() < 0.33 THEN ARRAY['مول سيتي ستارز - 5 دقائق', 'مستشفى دار الفؤاد - 10 دقائق', 'مدرسة الشروق - 3 دقائق']
    WHEN RANDOM() < 0.66 THEN ARRAY['جامعة القاهرة - 15 دقيقة', 'كارفور - 7 دقائق', 'نادي الزمالك - 20 دقيقة']
    ELSE ARRAY['مطار القاهرة - 30 دقيقة', 'محطة مترو المعادي - 5 دقائق', 'مستشفى معهد ناصر - 12 دقيقة']
  END
WHERE latitude IS NULL;

-- Add more property images for each property
DO $$
DECLARE
    prop RECORD;
    i INTEGER;
BEGIN
    FOR prop IN SELECT id FROM public.properties LOOP
        -- Add 2-4 more images per property
        FOR i IN 2..((RANDOM() * 3)::INTEGER + 2) LOOP
            INSERT INTO public.property_images (property_id, path, "order", public_url)
            VALUES (
                prop.id,
                '/property-' || ((RANDOM() * 5)::INTEGER + 1) || '.jpg',
                i,
                'https://levsbjqbbvonqugrolqp.supabase.co/storage/v1/object/public/property-images/property-' || ((RANDOM() * 5)::INTEGER + 1) || '.jpg'
            );
        END LOOP;
    END LOOP;
END $$;