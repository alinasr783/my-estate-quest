import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AdminAuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export const adminAuthService = {
  // تسجيل دخول الإدارة
  async login(email: string, password: string): Promise<AdminAuthResult> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, created_at')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
      }

      localStorage.setItem('currentAdmin', JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" };
    }
  },

  // تسجيل خروج الإدارة
  logout(): void {
    localStorage.removeItem('currentAdmin');
  },

  // الحصول على الإدارة الحالية
  getCurrentAdmin(): AdminUser | null {
    try {
      const adminStr = localStorage.getItem('currentAdmin');
      return adminStr ? JSON.parse(adminStr) : null;
    } catch {
      return null;
    }
  },

  // التحقق من حالة مصادقة الإدارة
  isAuthenticated(): boolean {
    return this.getCurrentAdmin() !== null;
  }
};