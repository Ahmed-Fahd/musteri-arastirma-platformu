import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCustomers } from '../hooks/useCustomers';
import { useLanguage } from '../contexts/LanguageContext';
import { ExportService } from '../services/exportService';
import { ImportService, ImportResult } from '../services/importService';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  FileJson,
  AlertCircle,
  CheckCircle,
  X,
  FileDown,
  Database
} from 'lucide-react';

interface ImportExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportExportPanel: React.FC<ImportExportPanelProps> = ({ isOpen, onClose }) => {
  const { customers, addCustomer } = useCustomers();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsImporting(true);
    setImportResult(null);
    
    try {
      let result: ImportResult;
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await ImportService.importFromExcel(file);
      } else if (file.name.endsWith('.csv')) {
        result = await ImportService.importFromCSV(file);
      } else if (file.name.endsWith('.json')) {
        result = await ImportService.importFromBackup(file);
      } else {
        result = {
          success: false,
          errors: ['Desteklenmeyen dosya formatı. Excel (.xlsx), CSV (.csv) veya JSON (.json) dosyası seçin.']
        };
      }
      
      setImportResult(result);
      
      // If successful, add customers
      if (result.success && result.data) {
        for (const customerData of result.data) {
          try {
            await addCustomer(customerData);
          } catch (error) {
            console.error('Error adding customer:', error);
          }
        }
      }
    } catch (error) {
      setImportResult({
        success: false,
        errors: ['Dosya işlenirken hata oluştu: ' + (error as Error).message]
      });
    } finally {
      setIsImporting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: false
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Veri İçe/Dışa Aktarma
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Dışa Aktarma
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            İçe Aktarma
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'export' ? (
            /* Export Tab */
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Müşteri Verilerini Dışa Aktar
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Toplam {customers.length} müşteri kaydı mevcut
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Excel Export */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Excel (.xlsx)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Gelişmiş analiz için</p>
                    </div>
                  </div>
                  <button
                    onClick={() => ExportService.exportToExcel(customers)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Excel İndir
                  </button>
                </div>

                {/* CSV Export */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">CSV (.csv)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Evrensel format</p>
                    </div>
                  </div>
                  <button
                    onClick={() => ExportService.exportToCSV(customers)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    CSV İndir
                  </button>
                </div>

                {/* PDF Export */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileDown className="w-8 h-8 text-red-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">PDF Raporu</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Yazdırılabilir format</p>
                    </div>
                  </div>
                  <button
                    onClick={() => ExportService.exportToPDF(customers)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    PDF İndir
                  </button>
                </div>

                {/* Backup Export */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Database className="w-8 h-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Yedek (.json)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tam veri yedeği</p>
                    </div>
                  </div>
                  <button
                    onClick={() => ExportService.exportBackup(customers)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Yedek İndir
                  </button>
                </div>
              </div>

              {/* Statistics Export */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">İstatistik Raporu</h4>
                <button
                  onClick={() => ExportService.exportStatistics(customers)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  İstatistik PDF İndir
                </button>
              </div>
            </div>
          ) : (
            /* Import Tab */
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Müşteri Verilerini İçe Aktar
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Excel, CSV veya JSON formatında dosya yükleyin
                </p>
              </div>

              {/* Template Downloads */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Şablon Dosyaları</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                  Doğru format için şablon dosyalarını indirin
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => ImportService.generateExcelTemplate()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Excel Şablonu
                  </button>
                  <button
                    onClick={() => ImportService.generateCSVTemplate()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    CSV Şablonu
                  </button>
                </div>
              </div>

              {/* File Drop Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Dosyayı buraya bırakın...
                  </p>
                ) : (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                      Dosyayı sürükleyip bırakın veya seçmek için tıklayın
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Excel (.xlsx), CSV (.csv) veya JSON (.json) formatları desteklenir
                    </p>
                  </div>
                )}
              </div>

              {/* Import Progress */}
              {isImporting && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Dosya işleniyor...
                    </span>
                  </div>
                </div>
              )}

              {/* Import Results */}
              {importResult && (
                <div className={`border rounded-lg p-4 ${
                  importResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start space-x-3">
                    {importResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        importResult.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                      }`}>
                        {importResult.success ? 'İçe Aktarma Başarılı!' : 'İçe Aktarma Hatası'}
                      </h4>
                      
                      {importResult.success && (
                        <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                          {importResult.validRows} / {importResult.totalRows} kayıt başarıyla eklendi
                        </p>
                      )}
                      
                      {importResult.errors && importResult.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-red-700 dark:text-red-300 text-sm font-medium mb-1">
                            Hatalar:
                          </p>
                          <ul className="text-red-600 dark:text-red-400 text-sm space-y-1">
                            {importResult.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                            {importResult.errors.length > 5 && (
                              <li>• ... ve {importResult.errors.length - 5} hata daha</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportPanel;