import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Bed, Bath, Square, ArrowLeft, Phone, MessageCircle, Share2, Heart } from "lucide-react";
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
}

const propertyImages = [property1, property2, property3, property4, property5];

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
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
        .single();
      
      if (error) throw error;
      setProperty(data);
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
    const hash = property?.id.charCodeAt(0) || 0;
    return propertyImages[hash % propertyImages.length];
  };

  const handleWhatsApp = () => {
    const message = `مرحباً، أنا مهتم بالعقار: ${property?.title}`;
    window.open(`https://wa.me/201234567890?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+201234567890', '_self');
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

        {/* Main Image */}
        <div className="relative mb-8">
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
            <div className="grid grid-cols-3 gap-4 mb-8">
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
            </div>

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
              </CardContent>
            </Card>
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
                  <p className="font-medium">+20 123 456 7890</p>
                </div>
                
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