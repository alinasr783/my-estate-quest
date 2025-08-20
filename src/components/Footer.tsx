import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* معلومات الشركة */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">العقارات الذهبية</h3>
                <p className="text-sm text-gray-300">شركة التسويق العقاري</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              نحن شركة رائدة في مجال التسويق العقاري في دولة الإمارات العربية المتحدة، 
              نقدم أفضل الخدمات العقارية والاستشارات المتخصصة لعملائنا الكرام.
            </p>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-accent pb-2">
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  العقارات
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  أفضل العقارات
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* معلومات التواصل */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-accent pb-2">
              تواصل معنا
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse text-sm">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-gray-300">+971 50 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse text-sm">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-gray-300">info@goldrealestate.ae</span>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse text-sm">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  دبي، الإمارات العربية المتحدة<br />
                  مركز دبي التجاري، الطابق 15
                </span>
              </div>
            </div>
          </div>

          {/* وسائل التواصل الاجتماعي */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-accent pb-2">
              تابعنا
            </h4>
            <div className="flex space-x-3 space-x-reverse">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-accent hover:bg-accent/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-accent hover:bg-accent/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-accent hover:bg-accent/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-accent hover:bg-accent/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-gray-400 mb-2">اشترك في النشرة الإخبارية</p>
              <div className="flex space-x-2 space-x-reverse">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm focus:outline-none focus:border-accent text-right"
                />
                <Button size="sm" className="bg-gradient-accent hover:bg-accent/90">
                  اشترك
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* الخط السفلي */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-right">
              © 2024 العقارات الذهبية. جميع الحقوق محفوظة.
            </p>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-accent transition-colors">
                سياسة الخصوصية
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-accent transition-colors">
                الشروط والأحكام
              </Link>
              <Button 
                variant="link" 
                onClick={onAdminClick}
                className="text-xs text-gray-500 hover:text-accent p-0 h-auto"
              >
                Are you the admin?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}