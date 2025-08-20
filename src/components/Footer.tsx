import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const { contactInfo, footerInfo, loading } = useSiteSettings();

  if (loading || !contactInfo || !footerInfo) {
    return (
      <footer className="bg-card border-t animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center animate-pulse-slow">جاري تحميل معلومات التواصل...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* معلومات الشركة */}
          <div className="animate-slide-in-left">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-primary animate-glow" />
              <h3 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                {contactInfo.company_name}
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              {footerInfo.about_text}
            </p>
            <div className="flex gap-4">
              {contactInfo.social_media.facebook && (
                <a href={contactInfo.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover-scale">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {contactInfo.social_media.instagram && (
                <a href={contactInfo.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover-scale">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {contactInfo.social_media.twitter && (
                <a href={contactInfo.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover-scale">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {contactInfo.social_media.linkedin && (
                <a href={contactInfo.social_media.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover-scale">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* خدماتنا */}
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-white">خدماتنا</h3>
            <ul className="space-y-2">
              {footerInfo.services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-primary transition-colors story-link hover-scale">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط سريعة */}
          <div className="animate-slide-in-right">
            <h3 className="text-lg font-semibold mb-4 text-white">روابط سريعة</h3>
            <ul className="space-y-2">
              {footerInfo.quick_links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-300 hover:text-primary transition-colors story-link hover-scale">
                    {link.title}
                  </a>
                </li>
              ))}
              <li>
                <button 
                  onClick={onAdminClick}
                  className="text-gray-300 hover:text-primary transition-colors story-link text-left hover-scale"
                >
                  لوحة الإدارة
                </button>
              </li>
            </ul>
          </div>

          {/* معلومات الاتصال */}
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-white">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 hover-scale">
                <Phone className="h-4 w-4 text-primary animate-bounce-subtle" />
                <a href={`tel:${contactInfo.phone}`} className="text-gray-300 hover:text-primary transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 hover-scale">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-2 hover-scale">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <p className="text-gray-300">
                  {contactInfo.address}
                </p>
              </div>
              <div className="flex items-center gap-2 hover-scale">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-gray-300">
                  {contactInfo.working_hours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center animate-fade-in">
          <p className="text-gray-400">
            © 2024 {contactInfo.company_name}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}