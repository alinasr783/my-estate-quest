import { supabase } from "@/integrations/supabase/client";

export interface WishlistItem {
  id: string;
  user_email: string;
  property_id: string;
  created_at: string;
}

export const wishlistService = {
  // إضافة عقار للمفضلة
  async addToWishlist(userEmail: string, propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_wishlist')
        .insert({
          user_email: userEmail,
          property_id: propertyId
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: "العقار موجود بالفعل في المفضلة" };
        }
        return { success: false, error: "حدث خطأ أثناء إضافة العقار للمفضلة" };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: "حدث خطأ أثناء إضافة العقار للمفضلة" };
    }
  },

  // إزالة عقار من المفضلة
  async removeFromWishlist(userEmail: string, propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_wishlist')
        .delete()
        .eq('user_email', userEmail)
        .eq('property_id', propertyId);

      if (error) {
        return { success: false, error: "حدث خطأ أثناء إزالة العقار من المفضلة" };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: "حدث خطأ أثناء إزالة العقار من المفضلة" };
    }
  },

  // الحصول على قائمة المفضلة للمستخدم
  async getUserWishlist(userEmail: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_wishlist')
        .select('property_id')
        .eq('user_email', userEmail);

      if (error) {
        return { success: false, error: "حدث خطأ أثناء جلب قائمة المفضلة" };
      }

      return { success: true, data: data?.map(item => item.property_id) || [] };
    } catch (err) {
      return { success: false, error: "حدث خطأ أثناء جلب قائمة المفضلة" };
    }
  },

  // التحقق من وجود عقار في المفضلة
  async isInWishlist(userEmail: string, propertyId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_wishlist')
        .select('id')
        .eq('user_email', userEmail)
        .eq('property_id', propertyId)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }
};