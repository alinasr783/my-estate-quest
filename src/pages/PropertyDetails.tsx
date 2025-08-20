import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Bed, Bath, Square, ArrowLeft, Phone, MessageCircle, Share2, Heart, Car, TreePine, Dumbbell, Shield, Waves, Building, Calendar, User, MapIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area_sq_m: number;
  property_type: string;
  listing_type: string;
  parking?: number;
  balcony?: number;
  furnished?: boolean;
  elevator?: boolean;
  garden?: boolean;
  pool?: boolean;
  security?: boolean;
  gym?: boolean;
  latitude?: number;
  longitude?: number;
  floor_number?: number;
  total_floors?: number;
  year_built?: number;
  agent_name?: string;
  agent_phone?: string;
  agent_whatsapp?: string;
  features?: string[];
  nearby_places?: string[];
}

interface PropertyImage {
  id: string;
  path: string;
  public_url?: string;
  order: number;
}

const propertyImages = [property1, property2, property3, property4, property5];

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (data) setProperty(data);

      // Load property images
      const { data: images, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', id)
        .order('order');
      
      if (imagesError) throw imagesError;
      setPropertyImages(images || []);
    } catch (error) {
      console.error('Error loading property:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل بيانات العقار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyImage = () => {
    const images = [property1, property2, property3, property4, property5];
    const hash = property?.id.charCodeAt(0) || 0;
    return images[hash % images.length];
  };

  const handleWhatsApp = () => {
    const message = `مرحباً، أنا مهتم بالعقار: ${property?.title}`;
    const phone = property?.agent_whatsapp || property?.agent_phone || '+201234567890';
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    const phone = property?.agent_phone || '+201234567890';
    window.open(`tel:${phone}`, '_self');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط العقار إلى الحافظة",
      });
    }
  };

  const handleFavorite = () => {
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة العقار إلى المفضلة",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header onLoginClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
        <Footer onAdminClick={() => {}} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header onLoginClick={() => {}} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">العقار غير موجود</h1>
          <Link to="/properties">
            <Button>العودة إلى العقارات</Button>
          </Link>
        </div>
        <Footer onAdminClick={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header onLoginClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/properties">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              العودة إلى العقارات
            </Button>
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8">
          {propertyImages.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {propertyImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="relative">
                      <img
                        src={image.public_url || getPropertyImage()}
                        alt={`${property.title} - صورة ${index + 1}`}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-background/80 text-foreground">
                            {property.listing_type}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          ) : (
            <div className="relative">
              <img
                src={getPropertyImage()}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/80 text-foreground">
                  {property.listing_type}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleFavorite}
              className="bg-background/80 hover:bg-background"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleShare}
              className="bg-background/80 hover:bg-background"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          {propertyImages.length > 1 && (
            <div className="absolute bottom-4 right-4">
              <Badge variant="secondary" className="bg-background/90">
                {propertyImages.length} صور
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-5 h-5 ml-2" />
                <span>{property.location}, {property.city}</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(property.price, property.currency)}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Property Features */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <Card className="text-center p-4">
                <Bed className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{property.bedrooms}</div>
                <div className="text-sm text-muted-foreground">غرف نوم</div>
              </Card>
              <Card className="text-center p-4">
                <Bath className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{property.bathrooms}</div>
                <div className="text-sm text-muted-foreground">حمامات</div>
              </Card>
              <Card className="text-center p-4">
                <Square className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{property.area_sq_m}</div>
                <div className="text-sm text-muted-foreground">متر مربع</div>
              </Card>
              {property.parking && property.parking > 0 && (
                <Card className="text-center p-4">
                  <Car className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold">{property.parking}</div>
                  <div className="text-sm text-muted-foreground">مواقف سيارات</div>
                </Card>
              )}
            </div>

            {/* Additional Features Grid */}
            {(property.furnished || property.elevator || property.garden || property.pool || property.security || property.gym) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>الميزات والخدمات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.furnished && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        مفروش
                      </div>
                    )}
                    {property.elevator && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-primary" />
                        مصعد
                      </div>
                    )}
                    {property.garden && (
                      <div className="flex items-center gap-2 text-sm">
                        <TreePine className="w-4 h-4 text-primary" />
                        حديقة
                      </div>
                    )}
                    {property.pool && (
                      <div className="flex items-center gap-2 text-sm">
                        <Waves className="w-4 h-4 text-primary" />
                        مسبح
                      </div>
                    )}
                    {property.security && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-primary" />
                        أمن وحراسة
                      </div>
                    )}
                    {property.gym && (
                      <div className="flex items-center gap-2 text-sm">
                        <Dumbbell className="w-4 h-4 text-primary" />
                        صالة رياضية
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>وصف العقار</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>معلومات العقار</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نوع العقار:</span>
                  <span className="font-medium">{property.property_type}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نوع العرض:</span>
                  <span className="font-medium">{property.listing_type}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المدينة:</span>
                  <span className="font-medium">{property.city}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الموقع:</span>
                  <span className="font-medium">{property.location}</span>
                </div>
                {property.floor_number && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الطابق:</span>
                      <span className="font-medium">{property.floor_number} من {property.total_floors}</span>
                    </div>
                  </>
                )}
                {property.year_built && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">سنة البناء:</span>
                      <span className="font-medium">{property.year_built}</span>
                    </div>
                  </>
                )}
                {property.balcony && property.balcony > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الشرفات:</span>
                      <span className="font-medium">{property.balcony}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>مميزات إضافية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nearby Places */}
            {property.nearby_places && property.nearby_places.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>الأماكن القريبة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {property.nearby_places.map((place, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        {place}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Google Map */}
            {property.latitude && property.longitude && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="w-5 h-5" />
                    الموقع على الخريطة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&hl=ar&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="mt-2 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://maps.google.com?q=${property.latitude},${property.longitude}`, '_blank')}
                    >
                      فتح في خرائط جوجل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>تواصل معنا</CardTitle>
                <CardDescription>
                  للاستفسار عن هذا العقار أو لحجز موعد للمعاينة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.agent_name && (
                  <div className="text-center border-b pb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{property.agent_name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">وكيل العقار</p>
                  </div>
                )}
                
                <Button onClick={handleCall} className="w-full flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  اتصل الآن
                </Button>
                <Button onClick={handleWhatsApp} variant="outline" className="w-full flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  واتساب
                </Button>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">رقم الهاتف</p>
                  <p className="font-medium">{property.agent_phone || '+20 123 456 7890'}</p>
                </div>
                
                {property.agent_whatsapp && property.agent_whatsapp !== property.agent_phone && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">واتساب</p>
                    <p className="font-medium">{property.agent_whatsapp}</p>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">ساعات العمل</p>
                  <p className="font-medium">السبت - الخميس</p>
                  <p className="text-sm text-muted-foreground">9:00 ص - 6:00 م</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer onAdminClick={() => {}} />
    </div>
  );
};

export default PropertyDetails;