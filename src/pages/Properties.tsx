import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { useToast } from "@/hooks/use-toast";

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

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedListingType, setSelectedListingType] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchTerm || 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === "all" || property.city === selectedCity;
    const matchesType = selectedType === "all" || property.property_type === selectedType;
    const matchesListingType = selectedListingType === "all" || property.listing_type === selectedListingType;
    
    return matchesSearch && matchesCity && matchesType && matchesListingType;
  });

  const handleFavorite = (propertyId: string) => {
    toast({
      title: "تمت الإضافة للمفضلة",
      description: "تم إضافة العقار إلى قائمة المفضلة",
    });
  };

  const handleContact = (propertyId: string) => {
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
    <div className="min-h-screen bg-background" dir="rtl">
      <Header onLoginClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">جميع العقارات</h1>
          <p className="text-lg text-muted-foreground">اكتشف مجموعة واسعة من العقارات المميزة</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="ابحث عن العقارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المدن</SelectItem>
                <SelectItem value="القاهرة">القاهرة</SelectItem>
                <SelectItem value="الجيزة">الجيزة</SelectItem>
                <SelectItem value="الإسكندرية">الإسكندرية</SelectItem>
                <SelectItem value="المنصورة">المنصورة</SelectItem>
                <SelectItem value="طنطا">طنطا</SelectItem>
                <SelectItem value="أسوان">أسوان</SelectItem>
                <SelectItem value="الأقصر">الأقصر</SelectItem>
                <SelectItem value="بورسعيد">بورسعيد</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="فيلا">فيلا</SelectItem>
                <SelectItem value="دوبلكس">دوبلكس</SelectItem>
                <SelectItem value="بنتهاوس">بنتهاوس</SelectItem>
                <SelectItem value="شاليه">شاليه</SelectItem>
                <SelectItem value="تاون هاوس">تاون هاوس</SelectItem>
                <SelectItem value="توين هاوس">توين هاوس</SelectItem>
                <SelectItem value="غرفة">غرفة</SelectItem>
                <SelectItem value="أرض سكنية">أرض سكنية</SelectItem>
                <SelectItem value="اي فيلا">اي فيلا</SelectItem>
                <SelectItem value="شقة فندقية">شقة فندقية</SelectItem>
                <SelectItem value="كبينة">كبينة</SelectItem>
                <SelectItem value="سطح">سطح</SelectItem>
                <SelectItem value="عقارات سكنية اخرى">عقارات سكنية اخرى</SelectItem>
                <SelectItem value="مكتب">مكتب</SelectItem>
                <SelectItem value="مجمع تجاري">مجمع تجاري</SelectItem>
                <SelectItem value="مستودع">مستودع</SelectItem>
                <SelectItem value="عيادة">عيادة</SelectItem>
                <SelectItem value="مصنع">مصنع</SelectItem>
                <SelectItem value="جراج">جراج</SelectItem>
                <SelectItem value="مطعم و كافيه">مطعم و كافيه</SelectItem>
                <SelectItem value="محلات تجارية">محلات تجارية</SelectItem>
                <SelectItem value="زراعي">زراعي</SelectItem>
                <SelectItem value="صناعي">صناعي</SelectItem>
                <SelectItem value="أرض تجارية">أرض تجارية</SelectItem>
                <SelectItem value="صيدليه">صيدليه</SelectItem>
                <SelectItem value="وحدة طبية">وحدة طبية</SelectItem>
                <SelectItem value="صالة عرض">صالة عرض</SelectItem>
                <SelectItem value="مكتب عمل جماعي">مكتب عمل جماعي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedListingType} onValueChange={setSelectedListingType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع العرض" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع العروض</SelectItem>
                <SelectItem value="للبيع">للبيع</SelectItem>
                <SelectItem value="للإيجار">للإيجار</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? "جاري التحميل..." : `تم العثور على ${filteredProperties.length} عقار`}
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={handleFavorite}
                onContact={handleContact}
                onShare={handleShare}
                imageIndex={index}
              />
            ))}
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">لم يتم العثور على عقارات تطابق البحث</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("all");
                setSelectedType("all");
                setSelectedListingType("all");
              }}
              variant="outline"
            >
              مسح الفلاتر
            </Button>
          </div>
        )}
      </main>
      
      <Footer onAdminClick={() => {}} />
    </div>
  );
};

export default Properties;