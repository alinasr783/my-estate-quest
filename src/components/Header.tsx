import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Search, Heart, Phone, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  user?: any;
  onLoginClick: () => void;
  onLogout?: () => void;
}

export default function Header({ user, onLoginClick, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: "الرئيسية", href: "/" },
    { icon: Search, label: "العقارات", href: "/properties" },
    { icon: Heart, label: "أفضل العقارات", href: "/featured" },
    { icon: Phone, label: "تواصل معنا", href: "/contact" },
    { icon: User, label: "من نحن", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                العقارات الذهبية
              </h1>
              <p className="text-xs text-muted-foreground">شركة التسويق العقاري</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-1 space-x-reverse text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-105"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {user ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  مرحباً، {user.first_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="text-sm"
                >
                  تسجيل خروج
                </Button>
              </div>
            ) : (
              <Button
                onClick={onLoginClick}
                className="bg-gradient-primary hover:bg-gradient-accent transition-all duration-300"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-1" />
                تسجيل دخول
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="text-center pb-4 border-b">
                    <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                      العقارات الذهبية
                    </h2>
                    <p className="text-sm text-muted-foreground">شركة التسويق العقاري</p>
                  </div>
                  
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t">
                    {user ? (
                      <div className="space-y-2">
                        <p className="text-sm text-center text-muted-foreground">
                          مرحباً، {user.first_name || user.email}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            onLogout?.();
                            setIsOpen(false);
                          }}
                        >
                          تسجيل خروج
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-gradient-primary hover:bg-gradient-accent"
                        onClick={() => {
                          onLoginClick();
                          setIsOpen(false);
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        تسجيل دخول
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}