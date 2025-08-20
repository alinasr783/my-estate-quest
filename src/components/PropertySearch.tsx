import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, Search, Tag, Building2, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

const RESIDENTIAL_TYPES = [
  "شقة",
  "فيلا", 
  "بنتهاوس",
  "دوبلكس",
  "استوديو",
  "غرفة وصالة",
  "غرفتين وصالة",
  "ثلاث غرف وصالة",
  "أربع غرف وصالة",
  "خمس غرف وصالة"
];

const COMMERCIAL_TYPES = [
  "مكتب",
  "محل تجاري",
  "مستودع",
  "معرض",
  "عيادة",
  "مطعم",
  "فندق",
  "مبنى كامل"
];

const PROPERTY_CATEGORIES = [
  { value: "residential", label: "سكني" },
  { value: "commercial", label: "تجاري" }
];

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    listingType: "",
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: ""
  });

  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [propertyCategory, setPropertyCategory] = useState<string>("");
  const [locationOpen, setLocationOpen] = useState(false);

  useEffect(() => {
    loadAvailableLocations();
  }, []);

  const loadAvailableLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('location')
        .not('location', 'is', null);

      if (error) throw error;
      
      const uniqueLocations = Array.from(new Set(data?.map(item => item.location).filter(Boolean))) as string[];
      setAvailableLocations(uniqueLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleSearch = () => {
    const cleanedFilters = {
      ...filters,
      propertyType: filters.propertyType === "all_property_types" ? "" : filters.propertyType,
      listingType: filters.listingType === "all_types" ? "" : filters.listingType,
      bedrooms: filters.bedrooms === "any_bedrooms" ? "" : filters.bedrooms,
      bathrooms: filters.bathrooms === "any_bathrooms" ? "" : filters.bathrooms
    };
    onSearch(cleanedFilters);
  };

  const getPropertyTypeOptions = () => {
    if (propertyCategory === "residential") {
      return RESIDENTIAL_TYPES;
    } else if (propertyCategory === "commercial") {
      return COMMERCIAL_TYPES;
    }
    return [];
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/95 border-0 shadow-xl animate-fade-in">
      <CardContent className="p-8">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-8">
          
          {/* الصف الأول - المعلومات الأساسية */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* نوع الإعلان */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Tag className="h-5 w-5 text-primary" />
                نوع الإعلان
              </Label>
              <Select 
                value={filters.listingType} 
                onValueChange={(value) => setFilters({...filters, listingType: value})}
              >
                <SelectTrigger className="h-14 bg-background border-2 hover:border-primary/50 transition-colors text-lg hover-scale">
                  <SelectValue placeholder="للبيع أو للإيجار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_types">الكل</SelectItem>
                  <SelectItem value="للبيع">للبيع</SelectItem>
                  <SelectItem value="للإيجار">للإيجار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* فئة العقار */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Building2 className="h-5 w-5 text-primary" />
                فئة العقار
              </Label>
              <Select
                value={propertyCategory}
                onValueChange={(value) => {
                  setPropertyCategory(value === "all_categories" ? "" : value);
                  setFilters({ ...filters, propertyType: "" });
                }}
              >
                <SelectTrigger className="h-14 bg-background border-2 hover:border-primary/50 transition-colors text-lg hover-scale">
                  <SelectValue placeholder="سكني أو تجاري" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_categories">جميع الفئات</SelectItem>
                  {PROPERTY_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* نوع العقار */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Home className="h-5 w-5 text-primary" />
                نوع العقار
              </Label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => setFilters({ ...filters, propertyType: value === "all_property_types" ? "" : value })}
                disabled={!propertyCategory}
              >
                <SelectTrigger className="h-14 bg-background border-2 hover:border-primary/50 transition-colors text-lg hover-scale">
                  <SelectValue placeholder={propertyCategory ? "اختر النوع" : "اختر الفئة أولاً"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_property_types">جميع الأنواع</SelectItem>
                  {getPropertyTypeOptions().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* الموقع - الأهم */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-foreground font-bold text-lg">
                <MapPin className="h-6 w-6 text-red-500 animate-bounce-subtle" />
                <span className="text-red-600">الموقع (الأهم)</span>
              </Label>
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={locationOpen}
                    className="h-14 w-full justify-between bg-background border-2 border-red-200 hover:border-red-400 transition-colors text-right text-lg font-medium hover-scale"
                  >
                    <span className={cn("truncate", !filters.location && "text-muted-foreground")}>
                      {filters.location || "اختر الموقع - مهم جداً للبحث الدقيق"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="ابحث عن الموقع..." className="text-right h-12" />
                    <CommandEmpty>لم يتم العثور على مواقع.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      <CommandItem
                        value="all_locations"
                        onSelect={() => {
                          setFilters({...filters, location: ""});
                          setLocationOpen(false);
                        }}
                        className="text-right py-3"
                      >
                        جميع المواقع
                      </CommandItem>
                      {availableLocations.map((location) => (
                        <CommandItem
                          key={location}
                          value={location}
                          onSelect={(currentValue) => {
                            setFilters({...filters, location: currentValue === filters.location ? "" : currentValue});
                            setLocationOpen(false);
                          }}
                          className="text-right py-3"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              filters.location === location ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {location}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* الصف الثاني - السعر والتفاصيل */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3 animate-fade-in">
              <Label className="text-foreground font-semibold text-base">السعر من (درهم)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="h-14 bg-background border-2 hover:border-primary/50 transition-colors text-right text-lg hover-scale"
              />
            </div>
            
            <div className="space-y-3 animate-fade-in">
              <Label className="text-foreground font-semibold text-base">السعر إلى (درهم)</Label>
              <Input
                type="number"
                placeholder="لا حدود"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="h-14 bg-background border-2 hover:border-primary/50 transition-colors text-right text-lg hover-scale"
              />
            </div>

            <div className="space-y-3 animate-fade-in">
              <Label className="text-foreground font-semibold text-base">غرف النوم</Label>
              <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value === "any_bedrooms" ? "" : value})}>
                <SelectTrigger className="h-14 bg-background border-2 hover:border-primary/50 transition-colors text-lg hover-scale">
                  <SelectValue placeholder="أي عدد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_bedrooms">أي عدد</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 animate-fade-in">
              <Label className="text-foreground font-semibold text-base">الحمامات</Label>
              <Select value={filters.bathrooms} onValueChange={(value) => setFilters({...filters, bathrooms: value === "any_bathrooms" ? "" : value})}>
                <SelectTrigger className="h-14 bg-background border-2 hover:border-primary/50 transition-colors text-lg hover-scale">
                  <SelectValue placeholder="أي عدد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_bathrooms">أي عدد</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full h-16 bg-gradient-primary hover:bg-gradient-accent text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-bounce-subtle"
          >
            <Search className="w-7 h-7 mr-3" />
            ابحث عن عقارك المثالي الآن
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}