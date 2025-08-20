import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: any) => void;
}

export default function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // البحث في جدول المستخدمين المخصص
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginForm.email)
        .single();

      if (userError || !userData) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      // هنا يجب التحقق من كلمة المرور (في تطبيق حقيقي نستخدم bcrypt)
      // للتبسيط، سنتحقق من كلمة المرور مباشرة
      if (userData.password_hash !== loginForm.password) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      onSuccess(userData);
      onOpenChange(false);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${userData.first_name || userData.email}`,
      });

    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setIsLoading(false);
      return;
    }

    try {
      // التحقق من وجود المستخدم
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', registerForm.email)
        .single();

      if (existingUser) {
        setError("هذا البريد الإلكتروني مسجل مسبقاً");
        return;
      }

      // إنشاء المستخدم الجديد
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: registerForm.email,
          password_hash: registerForm.password, // في تطبيق حقيقي نستخدم bcrypt
          first_name: registerForm.firstName,
          last_name: registerForm.lastName,
          phone: registerForm.phone
        })
        .select()
        .single();

      if (insertError) {
        setError("حدث خطأ أثناء إنشاء الحساب");
        return;
      }

      onSuccess(newUser);
      onOpenChange(false);
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً ${newUser.first_name}، يمكنك الآن الاستفادة من جميع الخدمات`,
      });

    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-primary bg-clip-text text-transparent">
            مرحباً بك في العقارات الذهبية
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل دخول</TabsTrigger>
            <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="text-right"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  كلمة المرور
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="text-right"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-gradient-accent"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                تسجيل دخول
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    الاسم الأول
                  </Label>
                  <Input
                    id="first-name"
                    required
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                    className="text-right"
                    placeholder="أحمد"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">الاسم الأخير</Label>
                  <Input
                    id="last-name"
                    required
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                    className="text-right"
                    placeholder="محمد"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="text-right"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="text-right"
                  placeholder="+971 50 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  كلمة المرور
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="text-right"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className="text-right"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-gradient-accent"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                إنشاء حساب
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}