// خدمة المصادقة المبسطة للعقارات الذهبية
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const authService = {
  // تسجيل دخول
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // استخدام RPC لتسجيل الدخول
      const { data, error } = await supabase.rpc('user_login', {
        p_email: email,
        p_password: password
      });

      if (error) {
        return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
      }

      if (!data || data.length === 0) {
        return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
      }

      const user = data[0];
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { success: true, user };
    } catch (err) {
      return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" };
    }
  },

  // تسجيل جديد
  async register(userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Promise<AuthResult> {
    try {
      // استخدام RPC للتسجيل
      const { data, error } = await supabase.rpc('user_register', {
        p_email: userData.email,
        p_password: userData.password,
        p_first_name: userData.first_name || '',
        p_last_name: userData.last_name || '',
        p_phone: userData.phone || ''
      });

      if (error) {
        if (error.message.includes('duplicate') || error.message.includes('already exists')) {
          return { success: false, error: "هذا البريد الإلكتروني مسجل مسبقاً" };
        }
        return { success: false, error: "حدث خطأ أثناء إنشاء الحساب" };
      }

      const user = data[0];
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { success: true, user };
    } catch (err) {
      return { success: false, error: "حدث خطأ أثناء إنشاء الحساب" };
    }
  },

  // تسجيل خروج
  logout(): void {
    localStorage.removeItem('currentUser');
  },

  // الحصول على المستخدم الحالي
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // التحقق من حالة المصادقة
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
};