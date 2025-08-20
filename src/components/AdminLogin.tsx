import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminAuthService, type AdminUser } from "@/services/adminAuth";
import { Shield, Lock, Mail } from "lucide-react";

interface AdminLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (admin: AdminUser) => void;
}

export default function AdminLogin({ open, onOpenChange, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        onSuccess(result.user);
        onOpenChange(false);
        setEmail("");
        setPassword("");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Shield className="h-5 w-5 text-primary" />
            دخول لوحة التحكم
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
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
            
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                البيانات الافتراضية: admin@admin.com / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}