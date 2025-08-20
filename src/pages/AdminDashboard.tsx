import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { analyticsService } from "@/services/analytics";
import { adminAuthService } from "@/services/adminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarChart3, Download, Users, Eye, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueUsers: 0,
    todayVisits: 0,
    topProperties: []
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من مصادقة الإدارة
    if (!adminAuthService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    loadAnalytics();
  }, [navigate]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getPropertyVisits();
      
      if (result.success && result.data) {
        setVisits(result.data);
        calculateStats(result.data);
      } else {
        toast({
          title: "خطأ",
          description: result.error || "حدث خطأ أثناء جلب التحليلات",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب التحليلات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (visitsData: any[]) => {
    const today = new Date().toDateString();
    const todayVisits = visitsData.filter(visit => 
      new Date(visit.visit_timestamp).toDateString() === today
    ).length;

    const uniqueUsers = new Set(
      visitsData.filter(visit => visit.user_email).map(visit => visit.user_email)
    ).size;

    // حساب العقارات الأكثر زيارة
    const propertyVisits = visitsData.reduce((acc: any, visit) => {
      const propertyId = visit.property_id;
      if (!acc[propertyId]) {
        acc[propertyId] = {
          property: visit.properties,
          count: 0
        };
      }
      acc[propertyId].count++;
      return acc;
    }, {});

    const topProperties = Object.values(propertyVisits)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalVisits: visitsData.length,
      uniqueUsers,
      todayVisits,
      topProperties
    });
  };

  const handleExportToExcel = () => {
    try {
      const csvContent = analyticsService.exportToExcel(visits);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `property_visits_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير البيانات إلى ملف Excel",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/');
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>جاري تحميل التحليلات...</p>
          </div>
        </div>
        <Footer onAdminClick={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للموقع
            </Button>
            <div>
              <h1 className="text-3xl font-bold">لوحة التحكم</h1>
              <p className="text-muted-foreground">تحليلات زيارات العقارات</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleExportToExcel}
              className="bg-gradient-primary hover:bg-gradient-accent"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير Excel
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              تسجيل خروج
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الزيارات</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون المسجلون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">زيارات اليوم</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العقارات المتتبعة</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(visits.map(v => v.property_id)).size}</div>
            </CardContent>
          </Card>
        </div>

        {/* العقارات الأكثر زيارة */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>العقارات الأكثر زيارة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats.topProperties as any[]).map((item: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.property?.title || 'عقار غير محدد'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.property?.location} - {item.property?.property_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {item.count} زيارة
                    </Badge>
                    <span className="text-sm font-medium">
                      {item.property?.price ? `${Number(item.property.price).toLocaleString()} درهم` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* جدول الزيارات */}
        <Card>
          <CardHeader>
            <CardTitle>سجل الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">العقار</TableHead>
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.slice(0, 50).map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>
                        {new Date(visit.visit_timestamp).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {visit.properties?.title || 'عقار محذوف'}
                      </TableCell>
                      <TableCell>{visit.user_name || 'غير مسجل'}</TableCell>
                      <TableCell>{visit.user_email || 'غير مسجل'}</TableCell>
                      <TableCell>{visit.properties?.location || '-'}</TableCell>
                      <TableCell>
                        {visit.properties?.price 
                          ? `${Number(visit.properties.price).toLocaleString()} درهم`
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {visits.length > 50 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  يتم عرض أحدث 50 زيارة. استخدم تصدير Excel لرؤية جميع البيانات.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer onAdminClick={() => {}} />
    </div>
  );
}