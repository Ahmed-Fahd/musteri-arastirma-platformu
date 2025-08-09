import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Rocket, 
  Target, 
  Users, 
  Brain, 
  Globe, 
  Building2, 
  TrendingUp, 
  Shield, 
  MessageSquare, 
  MapPin, 
  Calendar,
  DollarSign,
  Award,
  Lightbulb,
  Network,
  Zap,
  Star
} from 'lucide-react';

const DevelopmentVision: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: Building2,
      title: "Üye Firma Dashboard'ları",
      description: "Her MÜSİAD üyesine özel akıllı panel: faaliyet alanı, kapasite, hedef pazarlar, sertifikalar, ihracat geçmişi ve AI analizleri",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Brain,
      title: "AI Tabanlı Ülke-Müşteri Eşleştirme",
      description: "Firma verilerine göre sistem, ürünleriyle uyumlu pazarları ve olası distribütörleri önerir (örnek: \"X ürünleri için en uygun pazarlar: Katar, Almanya, Azerbaycan\")",
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Lightbulb,
      title: "Girişim Kartları & Yatırımcı Havuzu",
      description: "Yeni iş fikri olanlar, kart açar. Platform, bu fikri uygun yatırımcılara önerir. AI ile projenin fizibilitesi analiz edilir.",
      color: "from-yellow-600 to-orange-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Rol Bazlı Erişim Sistemi",
      description: "Standart Üye, Paydaş, Girişimci, Danışman gibi kullanıcı türlerine göre platformda farklı yetkiler tanımlanır.",
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: MessageSquare,
      title: "Güvenli Mesajlaşma Sistemi",
      description: "Firma profillerine göre şeffaflık kontrolü ve sistem içi iletişim modülü. Herkes herkese ulaşamaz. Onaylı firma rozetleri ile güven artırılır.",
      color: "from-indigo-600 to-indigo-700",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      icon: Globe,
      title: "Çok Dilli Kullanım (TR / EN / AR)",
      description: "MÜSİAD'ın yurt dışı ofisleri ve Arap ülkelerindeki üyeleri için büyük erişim kolaylığı sağlar.",
      color: "from-teal-600 to-teal-700",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    }
  ];

  const futureModules = [
    {
      icon: MapPin,
      title: "Harita Tabanlı Görselleştirme",
      description: "Firmalar, pazarlar ve iş fırsatları coğrafi olarak gösterilir."
    },
    {
      icon: Calendar,
      title: "AI ile Otomatik Etkinlik Üretimi",
      description: "Sistem, belirli sektörler için otomatik B2B eşleşme etkinlikleri önerir."
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "MÜSİAD Üyeleri İçin Gerçek Değer Üretir",
      description: "Sadece bir liste değil, aktif ticaret ve yatırım ağı."
    },
    {
      icon: Zap,
      title: "Zaman ve Kaynak Tasarrufu Sağlar",
      description: "Uygun müşteri, ülke ve iş ortağı AI ile birkaç saniyede önerilir."
    },
    {
      icon: TrendingUp,
      title: "Stratejik Kararları Destekler",
      description: "Raporlar ve analizler firmalara net yön verir."
    },
    {
      icon: Network,
      title: "Küresel Ulaşımı Kolaylaştırır",
      description: "Çok dilli yapı ile yurt dışı iş birlikleri hızlanır."
    }
  ];

  const targetGroups = [
    {
      title: "MÜSİAD Üyesi Firmalar",
      benefit: "Yurt içi ve dışı iş ortaklarıyla veriye dayalı eşleşmeler",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Yatırımcılar",
      benefit: "Erken aşama girişim fırsatlarına erişim",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Girişimciler",
      benefit: "Güvenilir yatırımcılara erişim + AI ile analiz",
      icon: Lightbulb,
      color: "text-yellow-600"
    },
    {
      title: "Danışmanlar",
      benefit: "Mentor desteği sunma ve projeleri analiz etme",
      icon: Award,
      color: "text-purple-600"
    },
    {
      title: "MÜSİAD Yöneticileri",
      benefit: "Üye ilişkilerini merkezden takip etme, rapor üretme",
      icon: Users,
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </button>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  BÖLÜM 2 – Gelişim Vizyonu
                </h1>
                <p className="text-xl text-blue-600 font-semibold">TradeScout MÜSİAD Özel</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                "Mevcut akıllı CRM altyapısının, stratejik B2B iş geliştirme platformuna evrilmesi"
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                TradeScout'un temel müşteri yönetimi altyapısı üzerine inşa edilecek olan "TradeScout MÜSİAD Özel", 
                sadece kayıt tutan bir CRM değil, üyeler arası gerçek iş fırsatlarını ortaya çıkaran, eşleştiren ve 
                analiz eden bir akıllı B2B iş birliği platformu olacaktır.
              </p>
            </div>
          </div>
        </div>

        {/* Geliştirmenin Amacı */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Target className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Geliştirmenin Amacı</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "MÜSİAD üyeleri arasında veriye dayalı güvenli ticaret ağı kurmak",
              "Firmalara yapay zekâ destekli pazar ve müşteri eşleşmeleri sunmak",
              "Girişimciler ile yatırımcıları organik olarak bir araya getirmek",
              "Yurt içi ve yurt dışındaki üyeler için çok dilli, merkezi bir iş geliştirme ortamı oluşturmak"
            ].map((goal, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yeni Stratejik Modüller */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Network className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni Eklenen Stratejik Modüller</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                <div className={`w-16 h-16 ${module.bgColor} dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6`}>
                  <module.icon className={`w-8 h-8 ${module.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{module.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{module.description}</p>
                <div className={`mt-4 h-1 bg-gradient-to-r ${module.color} rounded-full`}></div>
              </div>
            ))}
          </div>

          {/* Gelecek Modüller */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Rocket className="w-6 h-6 text-orange-600 mr-3" />
              Gelecek Modüller
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {futureModules.map((module, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <module.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{module.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{module.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Neden Geliştirilmeli */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Brain className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Neden Geliştirilmeli?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hedef Kitle */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Users className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Kimler İçin Faydalanılabilir Olacak?</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-bold">Hedef Kitle</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Sağladığı Fayda</th>
                </tr>
              </thead>
              <tbody>
                {targetGroups.map((group, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <group.icon className={`w-6 h-6 ${group.color}`} />
                        <span className="font-semibold text-gray-900 dark:text-white">{group.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{group.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stratejik Sonuç */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Award className="w-12 h-12" />
            <h2 className="text-3xl font-bold">Stratejik Sonuç</h2>
          </div>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            <strong>TradeScout MÜSİAD Özel;</strong> MÜSİAD'ın güçlü iş ağı yapısını akıllı dijital platforma taşıyarak, 
            üyeleri arasında ticaret hacmini artırır, girişimcilik ruhunu destekler ve küresel ölçekte yeni iş birliklerinin 
            kapısını açar.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Mevcut Sistemi İncele
            </button>
            <button
              onClick={() => navigate('/add-customer')}
              className="bg-yellow-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors"
            >
              Demo Verisi Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentVision;