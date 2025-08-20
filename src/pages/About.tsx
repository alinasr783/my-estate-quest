import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Target, Heart, Shield, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function About() {
  const { contentData } = useSiteSettings();

  const features = [
    {
      icon: Shield,
      title: "الثقة والأمان",
      description: "نضمن لك التعامل الآمن والموثوق في جميع العمليات العقارية"
    },
    {
      icon: Users,
      title: "فريق محترف",
      description: "فريق من الخبراء المتخصصين في السوق العقاري الإماراتي"
    },
    {
      icon: Target,
      title: "دقة في الاختيار",
      description: "نساعدك في العثور على العقار المناسب وفقاً لاحتياجاتك"
    },
    {
      icon: Heart,
      title: "خدمة عملاء مميزة",
      description: "نحن معك في كل خطوة من رحلة البحث عن العقار المثالي"
    }
  ];

  const stats = [
    { number: "1000+", label: "عقار مُدرج" },
    { number: "500+", label: "عميل سعيد" },
    { number: "50+", label: "منطقة" },
    { number: "10+", label: "سنوات خبرة" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} onLoginClick={() => {}} onLogout={() => {}} />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {contentData?.about_title || "من نحن"}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            {contentData?.about_description || "نحن شركة رائدة في مجال العقارات في دولة الإمارات العربية المتحدة، نقدم خدمات متميزة في البيع والشراء والإيجار"}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 animate-fade-in">
              <Badge variant="outline" className="w-fit">قصتنا</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                رحلة في عالم العقارات
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                بدأت رحلتنا من حلم بسيط: أن نكون الجسر بين العملاء وأحلامهم في امتلاك العقار المثالي. 
                على مدار سنوات من العمل الجاد والتطوير المستمر، نجحنا في بناء سمعة طيبة في السوق العقاري الإماراتي.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                نؤمن بأن كل عميل له احتياجات فريدة، ولذلك نقدم خدمات مخصصة تلبي توقعاتهم وتتجاوزها. 
                فريقنا من الخبراء المتخصصين يعمل بدون كلل لضمان حصولكم على أفضل الحلول العقارية.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 animate-fade-in">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 hover-scale">
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 animate-fade-in hover-scale">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">رسالتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  نسعى لتقديم خدمات عقارية متميزة تتسم بالجودة والمصداقية، ونهدف إلى أن نكون 
                  الخيار الأول للعملاء الباحثين عن العقار المثالي في دولة الإمارات.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 animate-fade-in hover-scale">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">رؤيتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون الشركة الرائدة في مجال الخدمات العقارية في المنطقة، معروفين بالابتكار 
                  والتميز في الخدمة وبناء علاقات طويلة الأمد مع عملائنا.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">لماذا تختارنا؟</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نقدم لك مجموعة من المميزات التي تجعل تجربتك معنا استثنائية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center animate-fade-in hover-scale group">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {contentData?.cta_title || "ابدأ رحلتك معنا"}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {contentData?.cta_subtitle || "اتصل بنا الآن للحصول على استشارة مجانية"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-300">
              تواصل معنا الآن
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300">
              تصفح العقارات
            </button>
          </div>
        </div>
      </section>

      <Footer onAdminClick={() => {}} />
    </div>
  );
}