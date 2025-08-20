import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Building2, Bed, Bath, Ruler } from "lucide-react";

interface SearchFilters {
  listingType: string;
  propertyCategory: string;
  propertyType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  minArea: string;
  maxArea: string;
}

const RESIDENTIAL_TYPES = [
  "شقة", "فيلا", "دوبلكس", "بنتهاوس", "شاليه", "تاون هاوس", 
  "توين هاوس", "غرفة", "أرض سكنية", "اي فيلا", "شقة فندقية", 
  "كبينة", "سطح", "عقارات سكنية اخرى"
];

const COMMERCIAL_TYPES = [
  "مكتب", "مجمع تجاري", "مستودع", "عيادة", "مصنع", "جراج",
  "مطعم و كافيه", "محلات تجارية", "زراعي", "صناعي", "أرض تجارية",
  "صيدليه", "سطح", "وحدة طبية", "صالة عرض", "مكتب عمل جماعي", "عقارات تجارية اخرى"
];

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    listingType: "",
    propertyCategory: "",
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: ""
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const getPropertyTypes = () => {
    return filters.propertyCategory === "سكني" ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES;
  };

  return (
    <Card className="w-full bg-gradient-card backdrop-blur-sm border-0 shadow-strong">
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            ابحث عن عقارك المثالي
          </h2>
          <p className="text-muted-foreground">اعثر على أفضل العقارات في الإمارات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* نوع العرض */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              نوع العرض
            </Label>
            <Select value={filters.listingType} onValueChange={(value) => setFilters({...filters, listingType: value})}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="اختر نوع العرض" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="للبيع">للبيع</SelectItem>
                <SelectItem value="للإيجار">للإيجار</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* فئة العقار */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              فئة العقار
            </Label>
            <Select value={filters.propertyCategory} onValueChange={(value) => setFilters({...filters, propertyCategory: value, propertyType: ""})}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="سكني أم تجاري" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="سكني">سكني</SelectItem>
                <SelectItem value="تجاري">تجاري</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* نوع العقار */}
          <div className="space-y-2">
            <Label>نوع العقار</Label>
            <Select 
              value={filters.propertyType} 
              onValueChange={(value) => setFilters({...filters, propertyType: value})}
              disabled={!filters.propertyCategory}
            >
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="اختر نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                {getPropertyTypes().map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الموقع */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              الموقع
            </Label>
            <Input
              placeholder="المدينة أو المنطقة"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="bg-background/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* السعر */}
          <div className="space-y-2">
            <Label>النطاق السعري (درهم)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="من"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="bg-background/80"
              />
              <Input
                placeholder="إلى"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="bg-background/80"
              />
            </div>
          </div>

          {/* الغرف والحمامات للسكني أو المساحة للتجاري */}
          {filters.propertyCategory === "سكني" ? (
            <div className="space-y-2">
              <Label>الغرف والحمامات</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Bed className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">غرف النوم</span>
                  </div>
                  <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                    <SelectTrigger className="bg-background/80">
                      <SelectValue placeholder="غرف" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Bath className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">الحمامات</span>
                  </div>
                  <Select value={filters.bathrooms} onValueChange={(value) => setFilters({...filters, bathrooms: value})}>
                    <SelectTrigger className="bg-background/80">
                      <SelectValue placeholder="حمامات" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : filters.propertyCategory === "تجاري" ? (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-primary" />
                المساحة (متر مربع)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="من"
                  type="number"
                  value={filters.minArea}
                  onChange={(e) => setFilters({...filters, minArea: e.target.value})}
                  className="bg-background/80"
                />
                <Input
                  placeholder="إلى"
                  type="number"
                  value={filters.maxArea}
                  onChange={(e) => setFilters({...filters, maxArea: e.target.value})}
                  className="bg-background/80"
                />
              </div>
            </div>
          ) : <div></div>}
        </div>

        <Button 
          onClick={handleSearch} 
          className="w-full bg-gradient-primary hover:bg-gradient-accent transition-all duration-300 hover:scale-105 shadow-glow"
        >
          <Search className="h-4 w-4 mr-2" />
          ابحث عن العقارات
        </Button>
      </div>
    </Card>
  );
}