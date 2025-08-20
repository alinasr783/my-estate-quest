import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Settings, Phone, Mail, Globe } from "lucide-react";

interface ContactInfo {
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  working_hours: string;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface SiteDataManagerProps {
  onCancel: () => void;
}

export default function SiteDataManager({ onCancel }: SiteDataManagerProps) {
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    company_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    working_hours: "",
    social_media: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: ""
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single();

      if (error) throw error;
      
      if (data) {
        setContactInfo(data.value as unknown as ContactInfo);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'contact_info',
          value: contactInfo as any
        });

      if (error) throw error;

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث بيانات الموقع بنجاح",
      });
      
      onCancel();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ البيانات",
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
          <Settings className="h-7 w-7 text-primary" />
          إدارة بيانات الموقع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* معلومات الشركة الأساسية */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Phone className="h-5 w-5" />
            معلومات الاتصال
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">اسم الشركة</Label>
              <Input
                id="company_name"
                value={contactInfo.company_name}
                onChange={(e) => setContactInfo({...contactInfo, company_name: e.target.value})}
                placeholder="العقارات الذهبية"
                className="animate-fade-in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                placeholder="+971501234567"
                className="animate-fade-in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">رقم الواتساب</Label>
              <Input
                id="whatsapp"
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                placeholder="+971501234567"
                className="animate-fade-in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                placeholder="info@goldenproperties.ae"
                className="animate-fade-in"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Textarea
              id="address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              placeholder="دبي مارينا، الإمارات العربية المتحدة"
              rows={3}
              className="animate-fade-in"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="working_hours">ساعات العمل</Label>
            <Input
              id="working_hours"
              value={contactInfo.working_hours}
              onChange={(e) => setContactInfo({...contactInfo, working_hours: e.target.value})}
              placeholder="الأحد - الخميس: 9:00 ص - 6:00 م"
              className="animate-fade-in"
            />
          </div>
        </div>

        {/* وسائل التواصل الاجتماعي */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            وسائل التواصل الاجتماعي
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={contactInfo.social_media.facebook}
                onChange={(e) => setContactInfo({
                  ...contactInfo, 
                  social_media: {...contactInfo.social_media, facebook: e.target.value}
                })}
                placeholder="https://facebook.com/goldenproperties"
                className="animate-fade-in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={contactInfo.social_media.instagram}
                onChange={(e) => setContactInfo({
                  ...contactInfo, 
                  social_media: {...contactInfo.social_media, instagram: e.target.value}
                })}
                placeholder="https://instagram.com/goldenproperties"
                className="animate-fade-in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={contactInfo.social_media.twitter}
                onChange={(e) => setContactInfo({
                  ...contactInfo, 
                  social_media: {...contactInfo.social_media, twitter: e.target.value}
                })}
                placeholder="https://twitter.com/goldenproperties"
                className="animate-fade-in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={contactInfo.social_media.linkedin}
                onChange={(e) => setContactInfo({
                  ...contactInfo, 
                  social_media: {...contactInfo.social_media, linkedin: e.target.value}
                })}
                placeholder="https://linkedin.com/company/goldenproperties"
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
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-primary hover:bg-gradient-accent hover-scale"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
      </CardContent>
    </Card>
  );
}