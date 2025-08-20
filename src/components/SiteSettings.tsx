import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save, ArrowLeft, Upload, Palette, Globe } from "lucide-react";

interface SiteConfig {
  site_name: string;
  site_logo: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  favicon_url: string;
  og_image: string;
  analytics_id: string;
  currency: string;
  language: string;
}

interface SiteSettingsProps {
  onBack: () => void;
}

export default function SiteSettings({ onBack }: SiteSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    site_name: "",
    site_logo: "",
    primary_color: "#0ea5e9",
    secondary_color: "#64748b",
    accent_color: "#f59e0b",
    favicon_url: "",
    og_image: "",
    analytics_id: "",
    currency: "AED",
    language: "ar",
  });

  useEffect(() => {
    loadSiteConfig();
  }, []);

  const loadSiteConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'site_config')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.value) {
        setSiteConfig(prev => ({ ...prev, ...(data.value as any) }));
      }
    } catch (error) {
      console.error('Error loading site config:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل إعدادات الموقع",
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
          key: 'site_config',
          value: siteConfig as any
        });

      if (error) throw error;

      // تطبيق الألوان الجديدة على الموقع
      applyColorTheme();

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث إعدادات الموقع بنجاح",
      });
    } catch (error) {
      console.error('Error saving site config:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const applyColorTheme = () => {
    const root = document.documentElement;
    
    // تحويل الألوان إلى HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(siteConfig.primary_color));
    root.style.setProperty('--secondary', hexToHsl(siteConfig.secondary_color));
    root.style.setProperty('--accent', hexToHsl(siteConfig.accent_color));

    // تحديث عنوان الموقع
    if (siteConfig.site_name) {
      document.title = siteConfig.site_name;
    }
  };

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setSiteConfig(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>جاري تحميل الإعدادات...</p>
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
              <Settings className="h-8 w-8 text-primary" />
              إعدادات الموقع
            </h1>
            <p className="text-muted-foreground">إدارة إعدادات ومظهر الموقع</p>
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
        {/* الإعدادات العامة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="site_name">اسم الموقع</Label>
                <Input
                  id="site_name"
                  value={siteConfig.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  placeholder="موقع العقارات الفاخرة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <Input
                  id="currency"
                  value={siteConfig.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  placeholder="AED"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="site_logo">رابط الشعار</Label>
                <Input
                  id="site_logo"
                  value={siteConfig.site_logo}
                  onChange={(e) => handleInputChange('site_logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon_url">رابط الـ Favicon</Label>
                <Input
                  id="favicon_url"
                  value={siteConfig.favicon_url}
                  onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات الألوان */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              ألوان الموقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primary_color">اللون الأساسي</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={siteConfig.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-20 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={siteConfig.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#0ea5e9"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary_color">اللون الثانوي</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={siteConfig.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-20 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={siteConfig.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#64748b"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accent_color">لون التمييز</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent_color"
                    type="color"
                    value={siteConfig.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="w-20 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={siteConfig.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    placeholder="#f59e0b"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                معاينة الألوان ستظهر بعد حفظ التغييرات
              </p>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات SEO والتتبع */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات SEO والتتبع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="og_image">صورة المشاركة (Open Graph)</Label>
                <Input
                  id="og_image"
                  value={siteConfig.og_image}
                  onChange={(e) => handleInputChange('og_image', e.target.value)}
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analytics_id">معرف Google Analytics</Label>
                <Input
                  id="analytics_id"
                  value={siteConfig.analytics_id}
                  onChange={(e) => handleInputChange('analytics_id', e.target.value)}
                  placeholder="GA-XXXXXXXXX"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}