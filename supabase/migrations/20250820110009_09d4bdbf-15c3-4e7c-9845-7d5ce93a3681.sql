-- Add some property images to the database
INSERT INTO property_images (property_id, path, public_url, "order") 
SELECT 
  id as property_id,
  '/images/property-' || (row_number() OVER () % 5 + 1) || '.jpg' as path,
  'https://images.unsplash.com/photo-' || (
    CASE (row_number() OVER () % 5 + 1)
      WHEN 1 THEN '1564013799-8-5c71629-b5ac-49cc-b2d2-5ecc204a8c7f'
      WHEN 2 THEN '1564013779-fc4fe8c8-7888-4fb3-b014-7946d6176b9f'
      WHEN 3 THEN '1560520031-c5a94c90-9c1f-4c0c-9a65-3a6e42b5b5d9'
      WHEN 4 THEN '1572120360-bd4b4afb-4c7a-43b1-a69e-73dcb01ebd55'
      ELSE '1580223645-a1ab8b3c-2c5f-48e6-8c7f-7e3f3f3f3f3f'
    END
  ) || '?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' as public_url,
  1 as "order"
FROM properties 
LIMIT 100;