import React, { useState } from 'react';
import { FactoryInfoService, FactoryInfo } from '../services/factoryInfoService';
import { Customer } from '../types/Customer';
import { 
  Factory, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  DollarSign,
  Users,
  Calendar,
  Award,
  Truck,
  X,
  Loader2,
  Building2
} from 'lucide-react';

interface FactoryInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

const FactoryInfoPanel: React.FC<FactoryInfoPanelProps> = ({ isOpen, onClose, customer }) => {
  const [factoryInfo, setFactoryInfo] = useState<FactoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGetFactoryInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await FactoryInfoService.getFactoryInfo(customer);
      setFactoryInfo(info);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Fabrika Bilgi Merkezi
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{customer.companyName} - Detaylı Bilgiler</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Get Info Button */}
          {!factoryInfo && !isLoading && (
            <div className="text-center mb-8">
              <button
                onClick={handleGetFactoryInfo}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors mx-auto"
              >
                <Building2 className="w-5 h-5" />
                <span>Fabrika Bilgilerini Getir</span>
              </button>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Gemini AI ile detaylı fabrika analizi
              </p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Fabrika bilgileri analiz ediliyor...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Factory Info */}
          {factoryInfo && (
            <div className="space-y-6">
              {/* Location Info */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Konum Bilgileri</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="space-y-2">
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Adres</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.location.address}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Şehir</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.location.city}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Ülke</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.location.country}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Koordinatlar</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.location.coordinates}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Saat Dilimi</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.location.timezone}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">İletişim Bilgileri</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Telefon</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.contact.phone}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">E-posta</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.contact.email}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Web Sitesi</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.contact.website}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Sosyal Medya</td>
                        <td className="py-2 text-gray-900 dark:text-white">
                          {factoryInfo.contact.socialMedia.length > 0 
                            ? factoryInfo.contact.socialMedia.join(', ') 
                            : 'Bilinmiyor'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Diller</td>
                        <td className="py-2 text-gray-900 dark:text-white">
                          {factoryInfo.contact.languages.length > 0 
                            ? factoryInfo.contact.languages.join(', ') 
                            : 'Bilinmiyor'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Info */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mali Durum</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Tahmini Ciro</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.financial.estimatedRevenue}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Çalışan Sayısı</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.financial.employeeCount}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Kuruluş Yılı</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.financial.foundingYear}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Pazar Değeri</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.financial.marketCap}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Kredi Notu</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.financial.creditRating}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Ödeme Koşulları</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.financial.paymentTerms}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Operational Info */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Operasyonel Bilgiler</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Üretim Kapasitesi</td>
                        <td className="py-2 text-gray-900 dark:text-white">{factoryInfo.operational.productionCapacity}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Sertifikalar</td>
                        <td className="py-2 text-gray-900 dark:text-white">
                          {factoryInfo.operational.certifications.length > 0 
                            ? factoryInfo.operational.certifications.join(', ') 
                            : 'Bilinmiyor'}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">İhracat Pazarları</td>
                        <td className="py-2 text-gray-900 dark:text-white">
                          {factoryInfo.operational.exportMarkets.length > 0 
                            ? factoryInfo.operational.exportMarkets.join(', ') 
                            : 'Bilinmiyor'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium text-gray-600 dark:text-gray-400">Ana Ürünler</td>
                        <td className="py-2 text-gray-900 dark:text-white">
                          {factoryInfo.operational.mainProducts.length > 0 
                            ? factoryInfo.operational.mainProducts.join(', ') 
                            : 'Bilinmiyor'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactoryInfoPanel;