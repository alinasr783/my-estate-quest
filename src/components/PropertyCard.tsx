import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Phone, MessageCircle, MapPin, Bed, Bath, Ruler, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";

const propertyImages = [property1, property2, property3, property4, property5];

interface PropertyCardProps {
  property: {
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
    image_url?: string;
  };
  onFavorite?: (propertyId: string) => void;
  onContact?: (propertyId: string) => void;
  onShare?: (propertyId: string) => void;
  onDetailsClick?: (propertyId: string) => void;
  isFavorited?: boolean;
  imageIndex?: number;
}

export default function PropertyCard({ 
  property, 
  onFavorite, 
  onContact, 
  onShare, 
  onDetailsClick,
  isFavorited = false,
  imageIndex = 0
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyImage = () => {
    if (property.image_url && !imageError) {
      return property.image_url;
    }
    return propertyImages[imageIndex % propertyImages.length];
  };

  const handleWhatsApp = () => {
    const message = `مرحباً، أنا مهتم بالعقار: ${property.title} - ${formatPrice(property.price, property.currency)}`;
    const whatsappUrl = `https://wa.me/971501234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-0">
      <div className="relative overflow-hidden">        
        <div className="relative h-48 bg-muted">
          <img
            src={getPropertyImage()}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* نوع العرض */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={property.listing_type === 'للبيع' ? 'default' : 'secondary'} className="bg-background/90 text-foreground">
              {property.listing_type}
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 left-3 z-10 backdrop-blur-sm ${
            isFavorited 
              ? 'text-red-500 hover:text-red-600 bg-white/80' 
              : 'text-white hover:text-red-500 bg-black/20 hover:bg-white/80'
          }`}
          onClick={() => onFavorite?.(property.id)}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          {/* نوع العقار */}
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {property.property_type}
            </Badge>
          </div>
          
          {/* عنوان العقار */}
          <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          {/* وصف قصير */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {property.description}
          </p>
          
          {/* العنوان */}
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            <span>{property.location}, {property.city}</span>
          </div>
          
          {/* السعر */}
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
            {formatPrice(property.price, property.currency)}
          </div>
        </div>

        {/* تفاصيل العقار السكني */}
        {(property.property_type === 'شقة' || property.property_type === 'فيلا' || property.property_type === 'دوبلكس' || property.property_type === 'بنتهاوس' || property.property_type === 'شاليه' || property.property_type === 'تاون هاوس' || property.property_type === 'توين هاوس' || property.property_type === 'غرفة' || property.property_type === 'أرض سكنية' || property.property_type === 'اي فيلا' || property.property_type === 'شقة فندقية' || property.property_type === 'كبينة' || property.property_type === 'سطح' || property.property_type === 'عقارات سكنية اخرى') && (
          <div className="space-y-3">
            {/* المساحة فقط للسكني */}
            <div className="flex items-center justify-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-2">
              <Ruler className="h-4 w-4 text-primary mr-1" />
              <span>{property.area_sq_m} م²</span>
            </div>

            {/* عدد الغرف والحمامات */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4 text-primary" />
                  <span>{property.bedrooms} غرفة</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4 text-primary" />
                  <span>{property.bathrooms} حمام</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* الأزرار */}
        <div className="space-y-2 pt-2">
          {/* زر واتساب يأخذ سطر كامل */}
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            تواصل عبر واتساب
          </Button>
          
          {/* باقي الأزرار */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={() => onContact?.(property.id)}
              variant="outline" 
              size="sm"
            >
              <Phone className="h-4 w-4 mr-1" />
              اتصال
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare?.(property.id)}
            >
              <Share2 className="h-4 w-4 mr-1" />
              مشاركة
            </Button>

            <Link to={`/property/${property.id}`} className="w-full">
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => onDetailsClick?.(property.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                تفاصيل
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}