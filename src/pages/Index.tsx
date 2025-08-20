import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, TrendingUp, Users, Home, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertySearch from "@/components/PropertySearch";
import PropertyCard from "@/components/PropertyCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { authService, type User } from "@/services/auth";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-bg.jpg";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listing_type: string;
  property_type: string;
  location: string;
  city: string;
  area_sq_m: number;
  bedrooms?: number;
  bathrooms?: number;
}

interface SearchFilters {
  listingType: string;
  propertyType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // تحميل المستخدم الحالي
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // تحميل العقارات المميزة
  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, description, price, currency, listing_type, property_type, location, city, area_sq_m, bedrooms, bathrooms')
        .limit(6);

      if (error) throw error;
      
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error loading featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('id, title, description, price, currency, listing_type, property_type, location, city, area_sq_m, bedrooms, bathrooms')
        .eq('status', 'active');

      // تطبيق الفلاتر
      if (filters.listingType) {
        query = query.eq('listing_type', filters.listingType);
      }
      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', parseInt(filters.bedrooms));
      }
      if (filters.bathrooms) {
        query = query.eq('bathrooms', parseInt(filters.bathrooms));
      }
      if (filters.minArea) {
        query = query.gte('area_sq_m', parseFloat(filters.minArea));
      }
      if (filters.maxArea) {
        query = query.lte('area_sq_m', parseFloat(filters.maxArea));
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      
      setSearchResults((data as any) || []);
      setHasSearched(true);
      
      toast({
        title: "تم البحث بنجاح",
        description: `تم العثور على ${data?.length || 0} عقار`,
      });

    } catch (error) {
      console.error('Error searching properties:', error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن العقارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuthDialog(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
  };

  const handleFavorite = (propertyId: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    toast({
      title: "تمت الإضافة للمفضلة",
      description: "تم إضافة العقار إلى قائمة المفضلة",
    });
  };

  const handleContact = (propertyId: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    toast({
      title: "تم التسجيل",
      description: "سيتم التواصل معك قريباً",
    });
  };

  const handleShare = (propertyId: string) => {
    navigator.share?.({
      title: "عقار من العقارات الذهبية",
      url: window.location.href
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط العقار",
      });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onLoginClick={() => setShowAuthDialog(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-accent text-accent-foreground px-6 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                العقارات الذهبية
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                اكتشف عقارك
                <span className="block bg-gradient-accent bg-clip-text text-transparent">
                  المثالي
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                أفضل العقارات في الإمارات العربية المتحدة بأسعار تنافسية وخدمة استثنائية
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <span>عقارات مميزة</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span>أسعار تنافسية</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span>خدمة متميزة</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="max-w-2xl mx-auto">
                <PropertySearch onSearch={handleSearch} />
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                  onClick={() => handleSearch({} as SearchFilters)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  تصفح جميع العقارات
                </Button>
                
                <Button className="bg-gradient-accent hover:bg-accent/90 shadow-glow">
                  <MapPin className="w-4 h-4 mr-2" />
                  العقارات القريبة مني
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* نتائج البحث */}
      {hasSearched && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">نتائج البحث</h2>
              <p className="text-muted-foreground">
                {searchResults.length > 0 
                  ? `تم العثور على ${searchResults.length} عقار يطابق معايير البحث`
                  : "لم يتم العثور على عقارات تطابق معايير البحث"
                }
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={handleFavorite}
                    onContact={handleContact}
                    onShare={handleShare}
                  />
                ))}
              </div>
            ) : hasSearched ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد عقارات</h3>
                  <p className="text-muted-foreground mb-4">
                    لم يتم العثور على عقارات تطابق معايير البحث الخاصة بك
                  </p>
                  <Button onClick={() => setHasSearched(false)}>
                    مشاهدة العقارات المميزة
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>
      )}

      {/* العقارات المميزة */}
      {!hasSearched && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-gradient-accent text-accent-foreground mb-4">
                مميز
              </Badge>
              <h2 className="text-3xl font-bold mb-4">العقارات المميزة</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                مجموعة مختارة من أفضل العقارات المتاحة في الإمارات، تم اختيارها بعناية لتناسب جميع الأذواق والميزانيات
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-6 bg-muted rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={handleFavorite}
                    onContact={handleContact}
                    onShare={handleShare}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent>
                  <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد عقارات مميزة</h3>
                  <p className="text-muted-foreground">
                    لم يتم إضافة أي عقارات مميزة بعد
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* الإحصائيات */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">1000+</div>
              <div className="text-primary-foreground/80">عقار مُدرج</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-primary-foreground/80">عميل سعيد</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-primary-foreground/80">منطقة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">10+</div>
              <div className="text-primary-foreground/80">سنوات خبرة</div>
            </div>
          </div>
        </div>
      </section>

      <Footer onAdminClick={() => setShowAdminLogin(true)} />

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
