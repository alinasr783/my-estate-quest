import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, TrendingUp, Users, Home, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PropertySearch from "@/components/PropertySearch";
import PropertyCard from "@/components/PropertyCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { authService, type User } from "@/services/auth";
import { wishlistService } from "@/services/wishlist";
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
  const [userWishlist, setUserWishlist] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // تحميل المستخدم الحالي وقائمة المفضلة
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserWishlist(currentUser.email);
    }
  }, []);

  const loadUserWishlist = async (userEmail: string) => {
    const result = await wishlistService.getUserWishlist(userEmail);
    if (result.success && result.data) {
      setUserWishlist(result.data);
    }
  };

  // تحميل العقارات المميزة
  useEffect(() => {
    loadFeaturedProperties();
    
    // Check for existing user session
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
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
    // إذا تم البحث من الصفحة الرئيسية، الانتقال لصفحة العقارات مع الفلاتر
    const searchParams = new URLSearchParams();
    
    if (filters.listingType && filters.listingType !== 'all_types') {
      searchParams.set('listingType', filters.listingType);
    }
    if (filters.propertyType && filters.propertyType !== 'all_property_types') {
      searchParams.set('propertyType', filters.propertyType);
    }
    if (filters.location && filters.location !== 'all_locations') {
      searchParams.set('location', filters.location);
    }
    if (filters.bedrooms && filters.bedrooms !== 'any_bedrooms') {
      searchParams.set('bedrooms', filters.bedrooms);
    }
    if (filters.bathrooms && filters.bathrooms !== 'any_bathrooms') {
      searchParams.set('bathrooms', filters.bathrooms);
    }
    if (filters.minPrice) {
      searchParams.set('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      searchParams.set('maxPrice', filters.maxPrice);
    }
    if (filters.minArea) {
      searchParams.set('minArea', filters.minArea);
    }
    if (filters.maxArea) {
      searchParams.set('maxArea', filters.maxArea);
    }
    
    // الانتقال لصفحة العقارات مع الفلاتر
    navigate(`/properties?${searchParams.toString()}`);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuthDialog(false);
    loadUserWishlist(loggedInUser.email);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserWishlist([]);
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
  };

  const handleFavorite = async (propertyId: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    const isInWishlist = userWishlist.includes(propertyId);
    
    if (isInWishlist) {
      const result = await wishlistService.removeFromWishlist(user.email, propertyId);
      if (result.success) {
        setUserWishlist(prev => prev.filter(id => id !== propertyId));
        toast({
          title: "تمت الإزالة من المفضلة",
          description: "تم إزالة العقار من قائمة المفضلة",
        });
      } else {
        toast({
          title: "خطأ",
          description: result.error,
          variant: "destructive",
        });
      }
    } else {
      const result = await wishlistService.addToWishlist(user.email, propertyId);
      if (result.success) {
        setUserWishlist(prev => [...prev, propertyId]);
        toast({
          title: "تمت الإضافة للمفضلة",
          description: "تم إضافة العقار إلى قائمة المفضلة",
        });
      } else {
        toast({
          title: "خطأ",
          description: result.error,
          variant: "destructive",
        });
      }
    }
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
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight">
                ابحث عن عقارك
                <span className="block bg-gradient-accent bg-clip-text text-transparent">
                  المثالي
                </span>
              </h1>
            </div>

            {/* Search Form - Full Width */}
            <div className="w-full max-w-none animate-fade-in delay-300">
              <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
                <PropertySearch onSearch={handleSearch} />
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
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
                  {searchResults.map((property, index) => (
                    <div key={property.id} className="w-full max-w-sm mx-auto">
                      <PropertyCard
                        property={property}
                        onFavorite={handleFavorite}
                        onContact={handleContact}
                        onShare={handleShare}
                        isFavorited={userWishlist.includes(property.id)}
                        imageIndex={index}
                      />
                    </div>
                  ))}
                </div>
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
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                العقارات المميزة
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                مجموعة مختارة من أفضل العقارات
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-pulse" />
                      <div className="h-4 bg-gradient-to-r from-muted via-muted/30 to-muted rounded animate-pulse" />
                      <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredProperties.length > 0 ? (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
                  {featuredProperties.map((property, index) => (
                    <div key={property.id} className="w-full max-w-sm mx-auto animate-fade-in hover:animate-scale-in">
                      <PropertyCard
                        property={property}
                        onFavorite={handleFavorite}
                        onContact={handleContact}
                        onShare={handleShare}
                        isFavorited={userWishlist.includes(property.id)}
                        imageIndex={index}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center bg-gradient-card backdrop-blur-sm border-0 shadow-strong">
                <CardContent>
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Home className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">لا توجد عقارات مميزة</h3>
                  <p className="text-muted-foreground mb-6">
                    لم يتم إضافة أي عقارات مميزة بعد
                  </p>
                  <Button className="bg-gradient-primary hover:bg-gradient-accent">
                    تصفح العقارات
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* الإحصائيات */}
      <section className="py-20 bg-gradient-primary text-primary-foreground relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">إنجازاتنا</h2>
            <p className="text-primary-foreground/80 text-lg">أرقام تتحدث عن نفسها</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-4 group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Home className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold animate-pulse">1000+</div>
              <div className="text-primary-foreground/80 font-medium">عقار مُدرج</div>
            </div>
            <div className="space-y-4 group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold animate-pulse">500+</div>
              <div className="text-primary-foreground/80 font-medium">عميل سعيد</div>
            </div>
            <div className="space-y-4 group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold animate-pulse">50+</div>
              <div className="text-primary-foreground/80 font-medium">منطقة</div>
            </div>
            <div className="space-y-4 group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold animate-pulse">10+</div>
              <div className="text-primary-foreground/80 font-medium">سنوات خبرة</div>
            </div>
          </div>
        </div>
      </section>

      <Footer onAdminClick={() => navigate('/admin')} />

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
