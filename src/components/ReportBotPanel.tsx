import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { ReportBotService, InvestorReportData } from '../services/reportBotService';
import { Customer } from '../types/Customer';
import { 
  FileText, 
  Download, 
  Bot, 
  Sparkles, 
  Building, 
  Globe, 
  TrendingUp,
  Users,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReportBotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer?: Customer;
}

const ReportBotPanel: React.FC<ReportBotPanelProps> = ({ isOpen, onClose, selectedCustomer }) => {
  const { customers } = useCustomers();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<'single' | 'bulk' | 'summary'>('single');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Ek form verileri
  const [additionalData, setAdditionalData] = useState<Partial<InvestorReportData>>({
    foundingYear: '',
    employeeCount: '',
    mainProducts: '',
    productionCapacity: '',
    certificates: '',
    technologyLevel: 'Orta',
    exportCountries: '',
    exportRatio: '',
    partnershipType: 'Distribütör',
    existingTurkishPartners: 'Yok',
    reporterName: ''
  });

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      if (reportType === 'single' && selectedCustomer) {
        // Tek müşteri raporu
        const reportData = ReportBotService.generateReportData(selectedCustomer, additionalData);
        await ReportBotService.generateInvestorReport(reportData);
      } else if (reportType === 'bulk') {
        // Seçili müşteriler için toplu rapor
        const customersToReport = customers.filter(c => selectedCustomers.includes(c.id));
        await ReportBotService.generateBulkReports(customersToReport);
      } else if (reportType === 'summary') {
        // Özet rapor
        await ReportBotService.generateSummaryReport(customers);
      }
      
      // Başarı mesajı göster
      alert('Rapor başarıyla oluşturuldu ve indirildi!');
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error);
      alert('Rapor oluşturulurken hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Rapor Botu
              </h2>
              <p className="text-gray-600 dark:text-gray-400">AI Destekli Yatırımcı Raporu Oluşturucu</p>
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
          {/* Rapor Tipi Seçimi */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rapor Tipi Seçin
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setReportType('single')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  reportType === 'single'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <Building className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Tek Firma</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detaylı firma raporu</p>
              </button>

              <button
                onClick={() => setReportType('bulk')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  reportType === 'bulk'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Toplu Rapor</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Seçili firmalar</p>
              </button>

              <button
                onClick={() => setReportType('summary')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  reportType === 'summary'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Özet Rapor</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Genel istatistikler</p>
              </button>
            </div>
          </div>

          {/* Tek Firma Raporu - Ek Bilgiler */}
          {reportType === 'single' && selectedCustomer && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ek Bilgiler (Opsiyonel)
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kuruluş Yılı
                    </label>
                    <input
                      type="text"
                      value={additionalData.foundingYear || ''}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, foundingYear: e.target.value }))}
                      placeholder="2015"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Çalışan Sayısı
                    </label>
                    <input
                      type="text"
                      value={additionalData.employeeCount || ''}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, employeeCount: e.target.value }))}
                      placeholder="150"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ana Ürünler
                    </label>
                    <input
                      type="text"
                      value={additionalData.mainProducts || ''}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, mainProducts: e.target.value }))}
                      placeholder="Mango suyu, konserve ananas"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      İhraç Edilen Ülkeler
                    </label>
                    <input
                      type="text"
                      value={additionalData.exportCountries || ''}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, exportCountries: e.target.value }))}
                      placeholder="BAE, Almanya"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Raporu Hazırlayan
                    </label>
                    <input
                      type="text"
                      value={additionalData.reporterName || ''}
                      onChange={(e) => setAdditionalData(prev => ({ ...prev, reporterName: e.target.value }))}
                      placeholder="Ali Musa - Sudanlı öğrenci"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toplu Rapor - Müşteri Seçimi */}
          {reportType === 'bulk' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Rapor Oluşturulacak Firmalar ({selectedCustomers.length} seçili)
              </h3>
              <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center space-x-3 p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleCustomerSelection(customer.id)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{customer.companyName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{customer.country} • {customer.sector}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Özellikleri Bilgisi */}
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  AI Destekli Özellikler
                </h4>
                <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Otomatik firma analizi ve değerlendirme</li>
                  <li>• Yatırım potansiyeli skorlama</li>
                  <li>• Akıllı öneri ve tavsiye sistemi</li>
                  <li>• Profesyonel PDF rapor formatı</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rapor Oluştur Butonu */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || (reportType === 'single' && !selectedCustomer) || (reportType === 'bulk' && selectedCustomers.length === 0)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Rapor Oluştur</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBotPanel;