import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Phone, MessageCircle, MapPin, Bed, Bath, Ruler } from "lucide-react";
import { useState } from "react";

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
  isFavorited?: boolean;
}

export default function PropertyCard({ 
  property, 
  onFavorite, 
  onContact, 
  onShare, 
  isFavorited = false 
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
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
          {property.image_url && !imageError ? (
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <div className="text-primary-foreground text-center">
                <Ruler className="h-12 w-12 mx-auto mb-2 opacity-60" />
                <p className="text-sm opacity-80">صورة العقار</p>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          <div className="flex items-center justify-between mb-2">
            <Badge variant={property.listing_type === 'للبيع' ? 'default' : 'secondary'}>
              {property.listing_type}
            </Badge>
            <Badge variant="outline">{property.property_type}</Badge>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {property.description}
          </p>
          
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            <span>{property.location}, {property.city}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {formatPrice(property.price, property.currency)}
            </div>
            <Badge variant="outline" className="text-xs">
              {property.property_type}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4 text-primary" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4 text-primary" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-primary" />
              <span>{property.area_sq_m} م²</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            واتساب
          </Button>
          
          <Button 
            onClick={() => onContact?.(property.id)}
            variant="outline" 
            className="flex-1"
            size="sm"
          >
            <Phone className="h-4 w-4 mr-1" />
            اتصال
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onShare?.(property.id)}
            className="shrink-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}