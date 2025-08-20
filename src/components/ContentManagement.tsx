import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Save, ArrowLeft, Upload } from "lucide-react";

interface ContentData {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_title: string;
  about_description: string;
  services_title: string;
  features_title: string;
  cta_title: string;
  cta_subtitle: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

interface ContentManagementProps {
  onBack: () => void;
}

export default function ContentManagement({ onBack }: ContentManagementProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [contentData, setContentData] = useState<ContentData>({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    about_title: "",
    about_description: "",
    services_title: "",
    features_title: "",
    cta_title: "",
    cta_subtitle: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'content_settings')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.value) {
        setContentData(prev => ({ ...prev, ...(data.value as any) }));
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل المحتوى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'content_settings',
          value: contentData as any
        });

      if (error) throw error;

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث محتوى الموقع بنجاح",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المحتوى",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ContentData, value: string) => {
    setContentData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              إدارة المحتوى
            </h1>
            <p className="text-muted-foreground">تحرير محتوى وعناصر الموقع</p>
          </div>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-primary hover:bg-gradient-accent animate-fade-in hover-scale"
        >
          {saving ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* محتوى الصفحة الرئيسية */}
        <Card>
          <CardHeader>
            <CardTitle>محتوى الصفحة الرئيسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hero_title">عنوان البانر الرئيسي</Label>
                <Input
                  id="hero_title"
                  value={contentData.hero_title}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  placeholder="ابحث عن عقارك المثالي"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">العنوان الفرعي للبانر</Label>
                <Input
                  id="hero_subtitle"
                  value={contentData.hero_subtitle}
                  onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                  placeholder="اكتشف أفضل العقارات في الإمارات"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero_description">وصف البانر الرئيسي</Label>
              <Textarea
                id="hero_description"
                value={contentData.hero_description}
                onChange={(e) => handleInputChange('hero_description', e.target.value)}
                placeholder="نحن نقدم أفضل الخدمات العقارية..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="about_title">عنوان قسم من نحن</Label>
                <Input
                  id="about_title"
                  value={contentData.about_title}
                  onChange={(e) => handleInputChange('about_title', e.target.value)}
                  placeholder="من نحن"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="services_title">عنوان قسم الخدمات</Label>
                <Input
                  id="services_title"
                  value={contentData.services_title}
                  onChange={(e) => handleInputChange('services_title', e.target.value)}
                  placeholder="خدماتنا"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_description">وصف من نحن</Label>
              <Textarea
                id="about_description"
                value={contentData.about_description}
                onChange={(e) => handleInputChange('about_description', e.target.value)}
                placeholder="نحن شركة رائدة في مجال العقارات..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* عناصر أخرى */}
        <Card>
          <CardHeader>
            <CardTitle>عناصر إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="features_title">عنوان قسم المميزات</Label>
                <Input
                  id="features_title"
                  value={contentData.features_title}
                  onChange={(e) => handleInputChange('features_title', e.target.value)}
                  placeholder="لماذا تختارنا"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_title">عنوان دعوة للعمل</Label>
                <Input
                  id="cta_title"
                  value={contentData.cta_title}
                  onChange={(e) => handleInputChange('cta_title', e.target.value)}
                  placeholder="ابدأ رحلتك معنا"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cta_subtitle">وصف دعوة للعمل</Label>
              <Input
                id="cta_subtitle"
                value={contentData.cta_subtitle}
                onChange={(e) => handleInputChange('cta_subtitle', e.target.value)}
                placeholder="اتصل بنا الآن للحصول على استشارة مجانية"
              />
            </div>
          </CardContent>
        </Card>

        {/* إعدادات SEO */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات تحسين محركات البحث (SEO)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meta_title">عنوان الصفحة (Meta Title)</Label>
              <Input
                id="meta_title"
                value={contentData.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                placeholder="أفضل موقع عقارات في الإمارات"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground">
                {contentData.meta_title.length}/60 حرف
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta_description">وصف الصفحة (Meta Description)</Label>
              <Textarea
                id="meta_description"
                value={contentData.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                placeholder="اكتشف أفضل العقارات للبيع والإيجار في الإمارات..."
                maxLength={160}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                {contentData.meta_description.length}/160 حرف
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta_keywords">الكلمات المفتاحية</Label>
              <Input
                id="meta_keywords"
                value={contentData.meta_keywords}
                onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                placeholder="عقارات، دبي، للبيع، للإيجار، شقق، فلل"
              />
              <p className="text-sm text-muted-foreground">
                افصل الكلمات بفواصل
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}