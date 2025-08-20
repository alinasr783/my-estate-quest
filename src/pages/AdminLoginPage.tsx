import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminAuthService, type AdminUser } from "@/services/adminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Mail, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // إذا كان الإدارة مسجل دخول، توجيه إلى لوحة التحكم
    if (adminAuthService.isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await adminAuthService.login(email, password);
      
      if (result.success && result.user) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: result.error || "حدث خطأ أثناء تسجيل الدخول",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للموقع
            </Button>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">دخول لوحة التحكم</CardTitle>
              <p className="text-muted-foreground">
                تسجيل دخول للإدارة
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@admin.com"
                    className="text-right"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    كلمة المرور
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="text-right"
                    disabled={loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:bg-gradient-accent"
                  disabled={loading}
                >
                  {loading ? "جاري تسجيل الدخول..." : "دخول"}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">البيانات الافتراضية:</h4>
                <p className="text-sm text-muted-foreground">
                  البريد الإلكتروني: admin@admin.com<br />
                  كلمة المرور: admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer onAdminClick={() => {}} />
    </div>
  );
}