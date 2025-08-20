import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, MapPin, Bath, Bed, Car, Eye, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Property {
  id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  location: string | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sq_m: number | null;
  parking: number | null;
  listing_type: string | null;
  created_at: string;
}

export default function Featured() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('listing_type', 'sale')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading featured properties:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل العقارات المميزة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-AE').format(price);
  };

  const handleAddToWishlist = (propertyId: string) => {
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة العقار إلى قائمة المفضلة",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={null} onLoginClick={() => {}} onLogout={() => {}} />
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} onLoginClick={() => {}} onLogout={() => {}} />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            العقارات المميزة
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            اكتشف أفضل العقارات المختارة بعناية لتلبي احتياجاتك وتطلعاتك
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {properties.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">لا توجد عقارات مميزة حالياً</h2>
              <p className="text-muted-foreground mb-8">
                نعمل على إضافة عقارات جديدة ومميزة قريباً
              </p>
              <Button asChild>
                <Link to="/properties">تصفح جميع العقارات</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  عقارات مختارة بعناية
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  تصفح مجموعة من أفضل العقارات التي تم اختيارها خصيصاً لتقدم لك أعلى مستويات الجودة والراحة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <Card key={property.id} className="group hover-scale animate-fade-in overflow-hidden">
                    <div className="relative">
                      <img
                        src="/placeholder.svg"
                        alt={property.title || "عقار"}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-gradient-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          مميز
                        </Badge>
                        <Badge variant="secondary" className="bg-background/90">
                          {property.property_type || "عقار"}
                        </Badge>
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-4 right-4 bg-background/90 hover:bg-background"
                        onClick={() => handleAddToWishlist(property.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {property.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                          {property.parking && property.parking > 0 && (
                            <div className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              <span>موقف</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs">
                          {property.area_sq_m} م²
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(property.price || 0)}
                          </span>
                          <span className="text-sm text-muted-foreground mr-1">
                            درهم
                          </span>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/property/${property.id}`}>
                            عرض التفاصيل
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Call to Action */}
              <div className="text-center mt-16">
                <Card className="max-w-2xl mx-auto p-8 bg-gradient-primary text-primary-foreground">
                  <CardContent className="space-y-4">
                    <h3 className="text-2xl font-bold">لم تجد ما تبحث عنه؟</h3>
                    <p className="text-primary-foreground/90">
                      تصفح مجموعتنا الكاملة من العقارات أو تواصل معنا للحصول على مساعدة شخصية
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button asChild variant="secondary">
                        <Link to="/properties">جميع العقارات</Link>
                      </Button>
                      <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                        <Link to="/contact">تواصل معنا</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer onAdminClick={() => {}} />
    </div>
  );
}