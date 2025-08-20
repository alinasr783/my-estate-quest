import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedListingType, setSelectedListingType] = useState<string>("all");

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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyImage = (index: number) => {
    return propertyImages[index % propertyImages.length];
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
                <SelectItem value="شقة">شقة</SelectItem>
                <SelectItem value="فيلا">فيلا</SelectItem>
                <SelectItem value="تاون هاوس">تاون هاوس</SelectItem>
                <SelectItem value="بنت هاوس">بنت هاوس</SelectItem>
                <SelectItem value="استوديو">استوديو</SelectItem>
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
              <Card key={property.id} className="overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={getPropertyImage(index)}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/80 text-foreground">
                      {property.listing_type}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{property.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 ml-1" />
                    <span className="text-sm">{property.location}, {property.city}</span>
                  </div>
                  
                  <div className="text-2xl font-bold text-primary mb-4">
                    {formatPrice(property.price, property.currency)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 ml-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 ml-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 ml-1" />
                      <span>{property.area_sq_m} م²</span>
                    </div>
                  </div>
                  
                  <Link to={`/property/${property.id}`}>
                    <Button className="w-full">
                      عرض التفاصيل
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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