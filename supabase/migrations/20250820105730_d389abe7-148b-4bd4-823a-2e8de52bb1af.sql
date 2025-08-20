-- Update properties to use Egyptian terms and EGP currency
UPDATE properties SET 
  currency = 'EGP',
  price = price * 0.5, -- Convert AED to EGP approximate rate
  city = CASE 
    WHEN city = 'Dubai' THEN 'القاهرة'
    WHEN city = 'Abu Dhabi' THEN 'الجيزة'
    WHEN city = 'Sharjah' THEN 'الإسكندرية'
    WHEN city = 'Ajman' THEN 'المنصورة'
    WHEN city = 'Ras Al Khaimah' THEN 'طنطا'
    WHEN city = 'Al Ain' THEN 'أسوان'
    WHEN city = 'Fujairah' THEN 'الأقصر'
    WHEN city = 'Umm Al Quwain' THEN 'بورسعيد'
    ELSE 'القاهرة'
  END,
  location = CASE 
    WHEN location LIKE '%Marina%' THEN 'المارينا'
    WHEN location LIKE '%Downtown%' THEN 'وسط البلد'
    WHEN location LIKE '%Hills%' THEN 'التلال'
    WHEN location LIKE '%Lakes%' THEN 'البحيرات'
    WHEN location LIKE '%Gardens%' THEN 'الحدائق'
    WHEN location LIKE '%Heights%' THEN 'المرتفعات'
    WHEN location LIKE '%Village%' THEN 'القرية'
    WHEN location LIKE '%Towers%' THEN 'الأبراج'
    WHEN location LIKE '%Residences%' THEN 'المساكن'
    WHEN location LIKE '%Park%' THEN 'الحديقة'
    ELSE 'المدينة'
  END,
  property_type = CASE 
    WHEN property_type = 'apartment' THEN 'شقة'
    WHEN property_type = 'villa' THEN 'فيلا'
    WHEN property_type = 'townhouse' THEN 'تاون هاوس'
    WHEN property_type = 'penthouse' THEN 'بنت هاوس'
    WHEN property_type = 'studio' THEN 'استوديو'
    ELSE 'شقة'
  END,
  listing_type = CASE 
    WHEN listing_type = 'sale' THEN 'للبيع'
    WHEN listing_type = 'rent' THEN 'للإيجار'
    ELSE 'للبيع'
  END,
  title = CASE 
    WHEN property_type = 'apartment' THEN 'شقة فاخرة في ' || location
    WHEN property_type = 'villa' THEN 'فيلا راقية في ' || location
    WHEN property_type = 'townhouse' THEN 'تاون هاوس مميز في ' || location
    WHEN property_type = 'penthouse' THEN 'بنت هاوس فخم في ' || location
    WHEN property_type = 'studio' THEN 'استوديو أنيق في ' || location
    ELSE 'عقار مميز في ' || location
  END,
  description = 'عقار استثنائي يتميز بالتصميم العصري والموقع المتميز. يوفر جميع وسائل الراحة والرفاهية مع إطلالات رائعة ومساحات واسعة.';