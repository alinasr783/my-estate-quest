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
        .select('*');

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
        className="relative min-h-[95vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-6 animate-fade-in">
              <Badge className="bg-gradient-accent text-accent-foreground px-8 py-3 text-base font-medium shadow-glow animate-pulse">
                <Sparkles className="w-5 h-5 mr-2" />
                العقارات الذهبية
              </Badge>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight animate-scale-in">
                اكتشف عقارك
                <span className="block bg-gradient-accent bg-clip-text text-transparent animate-pulse">
                  المثالي
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
                أفضل العقارات بأسعار تنافسية
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-white/90 animate-fade-in delay-300">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-medium">عقارات مميزة</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-medium">أسعار تنافسية</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-medium">خدمة متميزة</span>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in delay-500">
              <div className="max-w-3xl mx-auto backdrop-blur-md bg-white/10 rounded-2xl p-2 shadow-2xl border border-white/20">
                <PropertySearch onSearch={handleSearch} />
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={() => handleSearch({} as SearchFilters)}
                >
                  <Search className="w-5 h-5 mr-2" />
                  تصفح جميع العقارات
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-accent hover:bg-accent/90 shadow-glow transition-all duration-300 hover:scale-105"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  العقارات القريبة مني
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
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
                {searchResults.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={handleFavorite}
                    onContact={handleContact}
                    onShare={handleShare}
                    isFavorited={userWishlist.includes(property.id)}
                    imageIndex={index}
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
        <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <Badge className="bg-gradient-accent text-accent-foreground mb-6 px-6 py-2 text-sm font-medium shadow-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                مميز
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                العقارات المميزة
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                مجموعة مختارة من أفضل العقارات المتاحة في الإمارات، تم اختيارها بعناية لتناسب جميع الأذواق والميزانيات
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((property, index) => (
                  <div key={property.id} className="animate-fade-in hover:animate-scale-in">
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
