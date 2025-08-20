import { supabase } from "@/integrations/supabase/client";

export interface PropertyVisit {
  id: string;
  property_id: string;
  user_email?: string;
  user_name?: string;
  visit_timestamp: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
}

export const analyticsService = {
  // تسجيل زيارة عقار
  async trackPropertyVisit(
    propertyId: string, 
    userEmail?: string, 
    userName?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const visitData: any = {
        property_id: propertyId,
        ip_address: null, // يمكن إضافة IP detection لاحقاً
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      };

      if (userEmail) {
        visitData.user_email = userEmail;
      }
      if (userName) {
        visitData.user_name = userName;
      }

      const { error } = await supabase
        .from('property_visits')
        .insert(visitData);

      if (error) {
        console.error('Error tracking visit:', error);
        return { success: false, error: "حدث خطأ أثناء تسجيل الزيارة" };
      }

      return { success: true };
    } catch (err) {
      console.error('Error tracking visit:', err);
      return { success: false, error: "حدث خطأ أثناء تسجيل الزيارة" };
    }
  },

  // الحصول على تحليلات الزيارات (للإدارة)
  async getPropertyVisits(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('property_visits')
        .select(`
          *,
          properties (
            title,
            price,
            location,
            property_type
          )
        `)
        .order('visit_timestamp', { ascending: false });

      if (error) {
        return { success: false, error: "حدث خطأ أثناء جلب تحليلات الزيارات" };
      }

      return { success: true, data: data || [] };
    } catch (err) {
      return { success: false, error: "حدث خطأ أثناء جلب تحليلات الزيارات" };
    }
  },

  // تصدير البيانات إلى Excel (سيتم تنفيذه في الواجهة)
  exportToExcel(visits: any[]): string {
    const headers = ['التاريخ', 'العقار', 'السعر', 'الموقع', 'النوع', 'البريد الإلكتروني', 'الاسم'];
    const csvContent = [
      headers.join(','),
      ...visits.map(visit => [
        new Date(visit.visit_timestamp).toLocaleDateString('ar-SA'),
        visit.properties?.title || '',
        visit.properties?.price || '',
        visit.properties?.location || '',
        visit.properties?.property_type || '',
        visit.user_email || '',
        visit.user_name || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    return csvContent;
  }
};