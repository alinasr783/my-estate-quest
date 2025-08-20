import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Building2, DollarSign, MapPin, Home, Phone, Mail, Car, Waves, TreePine, Shield, Dumbbell, MoveVertical, Snowflake, Sofa, Upload, X } from "lucide-react";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  city: string;
  property_type: string;
  listing_type: string;
  bedrooms: string;
  bathrooms: string;
  area_sq_m: string;
  agent_name: string;
  agent_phone: string;
  agent_whatsapp: string;
  parking: boolean;
  balcony: boolean;
  garden: boolean;
  pool: boolean;
  gym: boolean;
  elevator: boolean;
  security: boolean;
  furnished: boolean;
  floor_number: string;
  total_floors: string;
  year_built: string;
}

const RESIDENTIAL_TYPES = [
  "شقة", "فيلا", "بنتهاوس", "دوبلكس", "استوديو",
  "غرفة وصالة", "غرفتين وصالة", "ثلاث غرف وصالة", "أربع غرف وصالة", "خمس غرف وصالة"
];

const COMMERCIAL_TYPES = [
  "مكتب", "محل تجاري", "مستودع", "معرض", "عيادة", "مطعم", "فندق", "مبنى كامل"
];

const UAE_CITIES = [
  "دبي", "أبوظبي", "الشارقة", "عجمان", "أم القيوين", "رأس الخيمة", "الفجيرة"
];

interface AddPropertyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddPropertyForm({ onSuccess, onCancel }: AddPropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState<string>("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ file: File; url: string; uploaded: boolean }[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    city: "",
    property_type: "",
    listing_type: "",
    bedrooms: "",
    bathrooms: "",
    area_sq_m: "",
    agent_name: "",
    agent_phone: "",
    agent_whatsapp: "",
    parking: false,
    balcony: false,
    garden: false,
    pool: false,
    gym: false,
    elevator: false,
    security: false,
    furnished: false,
    floor_number: "",
    total_floors: "",
    year_built: ""
  });

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPropertyTypes = () => {
    if (propertyCategory === "residential") return RESIDENTIAL_TYPES;
    if (propertyCategory === "commercial") return COMMERCIAL_TYPES;
    return [];
  };

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    const newImages: { file: File; url: string; uploaded: boolean }[] = [];

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        newImages.push({
          file,
          url: URL.createObjectURL(file),
          uploaded: false
        });
      }
    }

    setUploadedImages(prev => [...prev, ...newImages]);

    // رفع الصور إلى Supabase Storage
    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i];
      const fileName = `${Date.now()}-${image.file.name}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, image.file);

        if (error) throw error;

        // الحصول على الرابط المباشر
        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        // تحديث حالة الصورة
        setUploadedImages(prev => prev.map((img, index) => 
          img === image ? { ...img, url: urlData.publicUrl, uploaded: true } : img
        ));

      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "خطأ في رفع الصورة",
          description: `فشل في رفع الصورة: ${image.file.name}`,
          variant: "destructive",
        });
      }
    }
    
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.location || !formData.property_type) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // إضافة العقار أولاً
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          city: formData.city,
          property_type: formData.property_type,
          listing_type: formData.listing_type,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area_sq_m: formData.area_sq_m ? parseFloat(formData.area_sq_m) : null,
          agent_name: formData.agent_name,
          agent_phone: formData.agent_phone,
          agent_whatsapp: formData.agent_whatsapp,
          parking: formData.parking ? 1 : 0,
          balcony: formData.balcony ? 1 : 0,
          garden: formData.garden,
          pool: formData.pool,
          gym: formData.gym,
          elevator: formData.elevator,
          security: formData.security,
          furnished: formData.furnished,
          floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
          total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // إضافة الصور إلى جدول property_images
      if (uploadedImages.length > 0 && propertyData) {
        const imagePromises = uploadedImages
          .filter(img => img.uploaded)
          .map((img, index) => 
            supabase.from('property_images').insert({
              property_id: propertyData.id,
              path: img.url,
              public_url: img.url,
              order: index
            })
          );

        await Promise.all(imagePromises);
      }

      toast({
        title: "نجح الإضافة",
        description: "تم إضافة العقار والصور بنجاح",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إضافة العقار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Building2 className="h-7 w-7 text-primary" />
          إضافة عقار جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* المعلومات الأساسية */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان العقار *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="مثال: شقة فاخرة في دبي مارينا"
                  className="animate-fade-in"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">السعر (درهم) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="2500000"
                  className="animate-fade-in"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="listing_type">نوع الإعلان</Label>
                <Select value={formData.listing_type} onValueChange={(value) => handleInputChange('listing_type', value)}>
                  <SelectTrigger className="animate-fade-in">
                    <SelectValue placeholder="اختر نوع الإعلان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="للبيع">للبيع</SelectItem>
                    <SelectItem value="للإيجار">للإيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_category">فئة العقار</Label>
                <Select value={propertyCategory} onValueChange={(value) => {
                  setPropertyCategory(value);
                  handleInputChange('property_type', '');
                }}>
                  <SelectTrigger className="animate-fade-in">
                    <SelectValue placeholder="اختر فئة العقار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">سكني</SelectItem>
                    <SelectItem value="commercial">تجاري</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_type">نوع العقار *</Label>
                <Select 
                  value={formData.property_type} 
                  onValueChange={(value) => handleInputChange('property_type', value)}
                  disabled={!propertyCategory}
                >
                  <SelectTrigger className="animate-fade-in">
                    <SelectValue placeholder={propertyCategory ? "اختر نوع العقار" : "اختر الفئة أولاً"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getPropertyTypes().map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                  <SelectTrigger className="animate-fade-in">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {UAE_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">الموقع التفصيلي *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="مثال: دبي مارينا، برج الإمارات"
                className="animate-fade-in"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف العقار</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="أدخل وصفاً مفصلاً للعقار..."
                rows={4}
                className="animate-fade-in"
              />
            </div>
          </div>

          {/* تفاصيل العقار */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              تفاصيل العقار
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">غرف النوم</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="3"
                  className="animate-fade-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">الحمامات</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="2"
                  className="animate-fade-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_sq_m">المساحة (متر مربع)</Label>
                <Input
                  id="area_sq_m"
                  type="number"
                  min="0"
                  value={formData.area_sq_m}
                  onChange={(e) => handleInputChange('area_sq_m', e.target.value)}
                  placeholder="150.5"
                  className="animate-fade-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor_number">رقم الطابق</Label>
                <Input
                  id="floor_number"
                  type="number"
                  min="0"
                  value={formData.floor_number}
                  onChange={(e) => handleInputChange('floor_number', e.target.value)}
                  placeholder="5"
                  className="animate-fade-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_floors">إجمالي الطوابق</Label>
                <Input
                  id="total_floors"
                  type="number"
                  min="1"
                  value={formData.total_floors}
                  onChange={(e) => handleInputChange('total_floors', e.target.value)}
                  placeholder="20"
                  className="animate-fade-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year_built">سنة البناء</Label>
                <Input
                  id="year_built"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year_built}
                  onChange={(e) => handleInputChange('year_built', e.target.value)}
                  placeholder="2020"
                  className="animate-fade-in"
                />
              </div>
            </div>
          </div>

          {/* المزايا والخدمات */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">المزايا والخدمات</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'parking', label: 'موقف سيارة', icon: Car },
                { key: 'balcony', label: 'شرفة', icon: Building2 },
                { key: 'garden', label: 'حديقة', icon: TreePine },
                { key: 'pool', label: 'مسبح', icon: Waves },
                { key: 'gym', label: 'صالة رياضية', icon: Dumbbell },
                { key: 'elevator', label: 'مصعد', icon: MoveVertical },
                { key: 'security', label: 'أمن وحراسة', icon: Shield },
                { key: 'furnished', label: 'مفروش', icon: Sofa },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center space-x-2 space-x-reverse animate-fade-in">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof PropertyFormData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(key as keyof PropertyFormData, checked)}
                  />
                  <Label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* صور العقار */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              صور العقار
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">اضغط لرفع الصور</p>
                    <p className="text-sm text-muted-foreground">يمكنك رفع عدة صور معاً</p>
                  </div>
                </Label>
              </div>

              {uploadingImages && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري رفع الصور...
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {!image.uploaded && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* معلومات المسوق */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" />
              معلومات المسوق
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="agent_name">اسم المسوق</Label>
                <Input
                  id="agent_name"
                  value={formData.agent_name}
                  onChange={(e) => handleInputChange('agent_name', e.target.value)}
                  placeholder="أحمد محمد"
                  className="animate-fade-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent_phone">رقم الهاتف</Label>
                <Input
                  id="agent_phone"
                  value={formData.agent_phone}
                  onChange={(e) => handleInputChange('agent_phone', e.target.value)}
                  placeholder="+971501234567"
                  className="animate-fade-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent_whatsapp">واتساب</Label>
                <Input
                  id="agent_whatsapp"
                  value={formData.agent_whatsapp}
                  onChange={(e) => handleInputChange('agent_whatsapp', e.target.value)}
                  placeholder="+971501234567"
                  className="animate-fade-in"
                />
              </div>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="hover-scale"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-primary hover:bg-gradient-accent hover-scale"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة العقار
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}