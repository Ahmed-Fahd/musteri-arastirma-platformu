import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'tr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.addCustomer': 'Yeni Firma',
    'nav.records': 'Kayıtlar',
    'nav.dashboard': 'Dashboard',
    
    // Landing Page
    'landing.title': 'TradeScout',
    'landing.subtitle': 'Müşteri Araştırma Platformu',
    'landing.description': 'Bu sistem sayesinde müşteri bilgilerinizi kolayca girip kaydedebilirsiniz. Uluslararası ticaret fırsatlarınızı organize edin ve takip edin.',
    'landing.addCustomer': 'Yeni Firma Ekle',
    'landing.viewRecords': 'Kayıtları Görüntüle',
    'landing.customerManagement': 'Müşteri Yönetimi',
    'landing.customerManagementDesc': 'Potansiyel müşterilerinizin bilgilerini organize edin ve takip edin. Detaylı form yapısı ile tüm önemli bilgileri kaydedin.',
    'landing.internationalFocus': 'Uluslararası Odak',
    'landing.internationalFocusDesc': 'Dünya çapında ticaret fırsatlarını keşfedin. Ülke bazlı filtreleme ve sektörel analiz imkanları.',
    'landing.smartTracking': 'Akıllı Takip',
    'landing.smartTrackingDesc': 'Öncelik seviyelerine göre müşteri takibi yapın. Aksiyon notları ve follow-up durumlarını yönetin.',
    
    // Form
    'form.title': 'Yeni Firma Ekle',
    'form.subtitle': 'Potansiyel müşteri bilgilerini doldurun',
    'form.country': 'Ülke',
    'form.countryPlaceholder': 'Ülke seçin...',
    'form.companyName': 'Firma Adı',
    'form.companyNamePlaceholder': 'Firma adını girin...',
    'form.website': 'Web Sitesi',
    'form.websitePlaceholder': 'https://www.ornek.com',
    'form.sector': 'Sektör',
    'form.sectorPlaceholder': 'Sektör seçin...',
    'form.interestStatus': 'İlgi Durumu',
    'form.yes': 'Evet',
    'form.no': 'Hayır',
    'form.priority': 'Öncelik',
    'form.high': 'Yüksek',
    'form.medium': 'Orta',
    'form.low': 'Düşük',
    'form.followUpStatus': 'Takip Durumu',
    'form.noFollow': 'Takip Yok',
    'form.firstFollow': '1. Takip',
    'form.secondFollow': '2. Takip',
    'form.actionNote': 'Aksiyon Notu',
    'form.actionNotePlaceholder': 'Örn: Mail atıldı, numune gönderildi, toplantı planlandı...',
    'form.cancel': 'İptal',
    'form.save': 'Kaydet',
    'form.saving': 'Kaydediliyor...',
    'form.success': 'Başarılı!',
    'form.successMessage': 'Son kaydınız için teşekkürler. Müşteri bilgileri başarıyla kaydedildi.',
    'form.viewRecords': 'Kayıtları Görüntüle',
    
    // Records
    'records.title': 'Araştırma Kayıtları',
    'records.totalRecords': 'kayıt bulundu',
    'records.filters': 'Filtreler',
    'records.searchCompany': 'Firma Adı Ara',
    'records.searchPlaceholder': 'Firma adı...',
    'records.allCountries': 'Tüm Ülkeler',
    'records.allSectors': 'Tüm Sektörler',
    'records.allPriorities': 'Tüm Öncelikler',
    'records.dateRange': 'Tarih Aralığı',
    'records.from': 'Başlangıç',
    'records.to': 'Bitiş',
    'records.noRecords': 'Kayıt Bulunamadı',
    'records.noRecordsDesc': 'Arama kriterlerinize uygun kayıt bulunamadı.',
    'records.createFirst': 'İlk Kaydı Oluştur',
    'records.interestStatus': 'İlgi Durumu',
    'records.followUpStatus': 'Takip Durumu',
    'records.createdAt': 'Kayıt Tarihi',
    'records.website': 'Web Sitesi',
    'records.visit': 'Ziyaret Et',
    'records.actionNote': 'Aksiyon Notu',
    'records.edit': 'Düzenle',
    'records.delete': 'Sil',
    'records.confirmDelete': 'şirketini silmek istediğinizden emin misiniz?',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Genel Bakış',
    'dashboard.totalCustomers': 'Toplam Müşteri',
    'dashboard.interestedCustomers': 'İlgili Müşteri',
    'dashboard.highPriority': 'Yüksek Öncelik',
    'dashboard.inFollowUp': 'Takipte',
    'dashboard.countryDistribution': 'Ülke Dağılımı',
    'dashboard.sectorDistribution': 'Sektör Dağılımı',
    'dashboard.priorityDistribution': 'Öncelik Dağılımı',
    'dashboard.monthlyTrend': 'Aylık Trend',
    'dashboard.recentActivity': 'Son Aktiviteler',
    'dashboard.noData': 'Veri Bulunamadı',
    'dashboard.noDataDesc': 'Henüz analiz edilecek veri bulunmuyor.',
    
    // Common
    'common.backToHome': 'Ana Sayfaya Dön',
    'common.total': 'Toplam',
    'common.required': 'zorunludur',
    'common.optional': 'opsiyonel',
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.success': 'Başarılı',
    'common.countries': 'Ülke',
    'common.sectors': 'Sektör',
    'common.customers': 'Müşteri',
    'common.records': 'Kayıt',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.addCustomer': 'Add Customer',
    'nav.records': 'Records',
    'nav.dashboard': 'Dashboard',
    
    // Landing Page
    'landing.title': 'TradeScout',
    'landing.subtitle': 'Customer Research Platform',
    'landing.description': 'With this system, you can easily enter and save your customer information. Organize and track your international trade opportunities.',
    'landing.addCustomer': 'Add New Company',
    'landing.viewRecords': 'View Records',
    'landing.customerManagement': 'Customer Management',
    'landing.customerManagementDesc': 'Organize and track your potential customers information. Record all important details with detailed form structure.',
    'landing.internationalFocus': 'International Focus',
    'landing.internationalFocusDesc': 'Discover trade opportunities worldwide. Country-based filtering and sectoral analysis capabilities.',
    'landing.smartTracking': 'Smart Tracking',
    'landing.smartTrackingDesc': 'Track customers according to priority levels. Manage action notes and follow-up statuses.',
    
    // Form
    'form.title': 'Add New Company',
    'form.subtitle': 'Fill in potential customer information',
    'form.country': 'Country',
    'form.countryPlaceholder': 'Select country...',
    'form.companyName': 'Company Name',
    'form.companyNamePlaceholder': 'Enter company name...',
    'form.website': 'Website',
    'form.websitePlaceholder': 'https://www.example.com',
    'form.sector': 'Sector',
    'form.sectorPlaceholder': 'Select sector...',
    'form.interestStatus': 'Interest Status',
    'form.yes': 'Yes',
    'form.no': 'No',
    'form.priority': 'Priority',
    'form.high': 'High',
    'form.medium': 'Medium',
    'form.low': 'Low',
    'form.followUpStatus': 'Follow-up Status',
    'form.noFollow': 'No Follow-up',
    'form.firstFollow': '1st Follow-up',
    'form.secondFollow': '2nd Follow-up',
    'form.actionNote': 'Action Note',
    'form.actionNotePlaceholder': 'E.g: Email sent, sample sent, meeting planned...',
    'form.cancel': 'Cancel',
    'form.save': 'Save',
    'form.saving': 'Saving...',
    'form.success': 'Success!',
    'form.successMessage': 'Thank you for your last record. Customer information has been successfully saved.',
    'form.viewRecords': 'View Records',
    
    // Records
    'records.title': 'Research Records',
    'records.totalRecords': 'records found',
    'records.filters': 'Filters',
    'records.searchCompany': 'Search Company Name',
    'records.searchPlaceholder': 'Company name...',
    'records.allCountries': 'All Countries',
    'records.allSectors': 'All Sectors',
    'records.allPriorities': 'All Priorities',
    'records.dateRange': 'Date Range',
    'records.from': 'From',
    'records.to': 'To',
    'records.noRecords': 'No Records Found',
    'records.noRecordsDesc': 'No records found matching your search criteria.',
    'records.createFirst': 'Create First Record',
    'records.interestStatus': 'Interest Status',
    'records.followUpStatus': 'Follow-up Status',
    'records.createdAt': 'Created Date',
    'records.website': 'Website',
    'records.visit': 'Visit',
    'records.actionNote': 'Action Note',
    'records.edit': 'Edit',
    'records.delete': 'Delete',
    'records.confirmDelete': 'Are you sure you want to delete the company?',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.totalCustomers': 'Total Customers',
    'dashboard.interestedCustomers': 'Interested Customers',
    'dashboard.highPriority': 'High Priority',
    'dashboard.inFollowUp': 'In Follow-up',
    'dashboard.countryDistribution': 'Country Distribution',
    'dashboard.sectorDistribution': 'Sector Distribution',
    'dashboard.priorityDistribution': 'Priority Distribution',
    'dashboard.monthlyTrend': 'Monthly Trend',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.noData': 'No Data Found',
    'dashboard.noDataDesc': 'No data available for analysis yet.',
    
    // Common
    'common.backToHome': 'Back to Home',
    'common.total': 'Total',
    'common.required': 'required',
    'common.optional': 'optional',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.countries': 'Countries',
    'common.sectors': 'Sectors',
    'common.customers': 'Customers',
    'common.records': 'Records',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.addCustomer': 'إضافة عميل',
    'nav.records': 'السجلات',
    'nav.dashboard': 'لوحة التحكم',
    
    // Landing Page
    'landing.title': 'TradeScout',
    'landing.subtitle': 'منصة بحث العملاء',
    'landing.description': 'من خلال هذا النظام، يمكنك بسهولة إدخال وحفظ معلومات عملائك. تنظيم وتتبع فرص التجارة الدولية الخاصة بك.',
    'landing.addCustomer': 'إضافة شركة جديدة',
    'landing.viewRecords': 'عرض السجلات',
    'landing.customerManagement': 'إدارة العملاء',
    'landing.customerManagementDesc': 'تنظيم وتتبع معلومات العملاء المحتملين. تسجيل جميع التفاصيل المهمة مع هيكل نموذج مفصل.',
    'landing.internationalFocus': 'التركيز الدولي',
    'landing.internationalFocusDesc': 'اكتشف الفرص التجارية في جميع أنحاء العالم. إمكانيات التصفية حسب البلد والتحليل القطاعي.',
    'landing.smartTracking': 'التتبع الذكي',
    'landing.smartTrackingDesc': 'تتبع العملاء وفقاً لمستويات الأولوية. إدارة ملاحظات العمل وحالات المتابعة.',
    
    // Form
    'form.title': 'إضافة شركة جديدة',
    'form.subtitle': 'املأ معلومات العميل المحتمل',
    'form.country': 'البلد',
    'form.countryPlaceholder': 'اختر البلد...',
    'form.companyName': 'اسم الشركة',
    'form.companyNamePlaceholder': 'أدخل اسم الشركة...',
    'form.website': 'الموقع الإلكتروني',
    'form.websitePlaceholder': 'https://www.example.com',
    'form.sector': 'القطاع',
    'form.sectorPlaceholder': 'اختر القطاع...',
    'form.interestStatus': 'حالة الاهتمام',
    'form.yes': 'نعم',
    'form.no': 'لا',
    'form.priority': 'الأولوية',
    'form.high': 'عالية',
    'form.medium': 'متوسطة',
    'form.low': 'منخفضة',
    'form.followUpStatus': 'حالة المتابعة',
    'form.noFollow': 'لا توجد متابعة',
    'form.firstFollow': 'المتابعة الأولى',
    'form.secondFollow': 'المتابعة الثانية',
    'form.actionNote': 'ملاحظة العمل',
    'form.actionNotePlaceholder': 'مثال: تم إرسال بريد إلكتروني، تم إرسال عينة، تم التخطيط لاجتماع...',
    'form.cancel': 'إلغاء',
    'form.save': 'حفظ',
    'form.saving': 'جاري الحفظ...',
    'form.success': 'نجح!',
    'form.successMessage': 'شكراً لك على سجلك الأخير. تم حفظ معلومات العميل بنجاح.',
    'form.viewRecords': 'عرض السجلات',
    
    // Records
    'records.title': 'سجلات البحث',
    'records.totalRecords': 'سجل موجود',
    'records.filters': 'المرشحات',
    'records.searchCompany': 'البحث عن اسم الشركة',
    'records.searchPlaceholder': 'اسم الشركة...',
    'records.allCountries': 'جميع البلدان',
    'records.allSectors': 'جميع القطاعات',
    'records.allPriorities': 'جميع الأولويات',
    'records.dateRange': 'نطاق التاريخ',
    'records.from': 'من',
    'records.to': 'إلى',
    'records.noRecords': 'لم يتم العثور على سجلات',
    'records.noRecordsDesc': 'لم يتم العثور على سجلات تطابق معايير البحث الخاصة بك.',
    'records.createFirst': 'إنشاء أول سجل',
    'records.interestStatus': 'حالة الاهتمام',
    'records.followUpStatus': 'حالة المتابعة',
    'records.createdAt': 'تاريخ الإنشاء',
    'records.website': 'الموقع الإلكتروني',
    'records.visit': 'زيارة',
    'records.actionNote': 'ملاحظة العمل',
    'records.edit': 'تحرير',
    'records.delete': 'حذف',
    'records.confirmDelete': 'هل أنت متأكد من أنك تريد حذف الشركة؟',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.totalCustomers': 'إجمالي العملاء',
    'dashboard.interestedCustomers': 'العملاء المهتمون',
    'dashboard.highPriority': 'أولوية عالية',
    'dashboard.inFollowUp': 'في المتابعة',
    'dashboard.countryDistribution': 'توزيع البلدان',
    'dashboard.sectorDistribution': 'توزيع القطاعات',
    'dashboard.priorityDistribution': 'توزيع الأولويات',
    'dashboard.monthlyTrend': 'الاتجاه الشهري',
    'dashboard.recentActivity': 'النشاط الأخير',
    'dashboard.noData': 'لم يتم العثور على بيانات',
    'dashboard.noDataDesc': 'لا توجد بيانات متاحة للتحليل حتى الآن.',
    
    // Common
    'common.backToHome': 'العودة للرئيسية',
    'common.total': 'المجموع',
    'common.required': 'مطلوب',
    'common.optional': 'اختياري',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.countries': 'البلدان',
    'common.sectors': 'القطاعات',
    'common.customers': 'العملاء',
    'common.records': 'السجلات',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('tradescout-language') as Language;
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tradescout-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};