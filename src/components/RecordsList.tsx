import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import ImportExportPanel from './ImportExportPanel';
import ReportBotPanel from './ReportBotPanel';
import { ArrowLeft, Search, Filter, Globe, Building, ExternalLink, Trash2, Edit, Calendar, Download, Upload, Bot } from 'lucide-react';
import AIAnalysisPanel from './AIAnalysisPanel';
import FactoryInfoPanel from './FactoryInfoPanel';
import { countries } from '../data/countries';
import { sectors } from '../data/sectors';

const RecordsList: React.FC = () => {
  const navigate = useNavigate();
  const { customers, deleteCustomer, loading, error } = useCustomers();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showImportExport, setShowImportExport] = useState(false);
  const [showReportBot, setShowReportBot] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showFactoryInfo, setShowFactoryInfo] = useState(false);
  const [selectedCustomerForReport, setSelectedCustomerForReport] = useState<any>(null);
  const [selectedCustomerForAI, setSelectedCustomerForAI] = useState<any>(null);
  const [selectedCustomerForFactory, setSelectedCustomerForFactory] = useState<any>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = !selectedCountry || customer.country === selectedCountry;
      const matchesSector = !selectedSector || customer.sector === selectedSector;
      const matchesPriority = !selectedPriority || customer.priority === selectedPriority;
      
      let matchesDate = true;
      if (dateFrom || dateTo) {
        const customerDate = new Date(customer.createdAt);
        if (dateFrom) {
          matchesDate = matchesDate && customerDate >= new Date(dateFrom);
        }
        if (dateTo) {
          matchesDate = matchesDate && customerDate <= new Date(dateTo + 'T23:59:59');
        }
      }
      
      return matchesSearch && matchesCountry && matchesSector && matchesPriority && matchesDate;
    });
  }, [customers, searchTerm, selectedCountry, selectedSector, selectedPriority, dateFrom, dateTo]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return t('form.high');
      case 'medium': return t('form.medium');
      case 'low': return t('form.low');
      default: return priority;
    }
  };

  const getInterestText = (interest: string) => {
    return interest === 'yes' ? t('form.yes') : t('form.no');
  };

  const getFollowUpText = (status: string) => {
    switch (status) {
      case 'first-follow': return t('form.firstFollow');
      case 'second-follow': return t('form.secondFollow');
      case 'none': return t('form.noFollow');
      default: return status;
    }
  };

  const handleDelete = (id: string, companyName: string) => {
    if (window.confirm(`"${companyName}" ${t('records.confirmDelete')}`)) {
      deleteCustomer(id).catch(err => {
        console.error('Delete error:', err);
        alert('Silme işlemi sırasında hata oluştu');
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <LoadingSpinner size="lg" text={t('common.loading')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.backToHome')}</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('records.title')}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t('common.total')} {customers.length} {t('records.totalRecords')}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReportBot(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span>Rapor Botu</span>
              </button>
              <button
                onClick={() => setShowImportExport(true)}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>İçe/Dışa Aktar</span>
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">{error} - Çevrimdışı modda çalışıyor</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('records.filters')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('records.searchCompany')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('records.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('form.country')}
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">{t('records.allCountries')}</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('form.sector')}
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">{t('records.allSectors')}</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('form.priority')}
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">{t('records.allPriorities')}</option>
                <option value="high">{t('form.high')}</option>
                <option value="medium">{t('form.medium')}</option>
                <option value="low">{t('form.low')}</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('');
                  setSelectedSector('');
                  setSelectedPriority('');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('records.dateRange')}
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={t('records.from')}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={t('records.to')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Globe className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('records.noRecords')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {customers.length === 0 
                ? 'Henüz hiç müşteri kaydı bulunmuyor.'
                : t('records.noRecordsDesc')
              }
            </p>
            <button
              onClick={() => navigate('/add-customer')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('records.createFirst')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {customer.companyName}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Globe className="w-4 h-4" />
                        <span>{customer.country}</span>
                        <span>•</span>
                        <span>{customer.sector}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(customer.priority)}`}>
                      {getPriorityText(customer.priority)}
                    </span>
                    <button
                      onClick={() => navigate(`/customer/${customer.id}`)}
                      className="p-2 text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                      title={t('records.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCustomerForAI(customer);
                        setShowAIAnalysis(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                      title="AI Analizi"
                    >
                      <Bot className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCustomerForFactory(customer);
                        setShowFactoryInfo(true);
                      }}
                      className="p-2 text-gray-400 hover:text-orange-600 dark:text-gray-500 dark:hover:text-orange-400 transition-colors"
                      title="Fabrika Bilgileri"
                    >
                      <Building className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.companyName)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                      title={t('records.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('records.interestStatus')}</span>
                    <p className="text-gray-900 dark:text-white">{getInterestText(customer.interestStatus)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('records.followUpStatus')}</span>
                    <p className="text-gray-900 dark:text-white">{getFollowUpText(customer.followUpStatus)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('records.createdAt')}</span>
                    <p className="text-gray-900 dark:text-white">{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                  {customer.website && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('records.website')}</span>
                      <a
                        href={customer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                      >
                        <span className="text-sm">{t('records.visit')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {customer.actionNote && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">{t('records.actionNote')}</span>
                    <p className="text-gray-800 dark:text-gray-200">{customer.actionNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredCustomers.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Özet İstatistikler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {filteredCustomers.filter(c => c.interestStatus === 'yes').length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{t('dashboard.interestedCustomers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredCustomers.filter(c => c.priority === 'high').length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{t('dashboard.highPriority')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredCustomers.filter(c => c.followUpStatus !== 'none').length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{t('dashboard.inFollowUp')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(filteredCustomers.map(c => c.country)).size}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Farklı {t('common.countries')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Import/Export Panel */}
        <ImportExportPanel 
          isOpen={showImportExport} 
          onClose={() => setShowImportExport(false)} 
        />

        {/* Report Bot Panel */}
        <ReportBotPanel 
          isOpen={showReportBot} 
          onClose={() => {
            setShowReportBot(false);
            setSelectedCustomerForReport(null);
          }}
          selectedCustomer={selectedCustomerForReport}
        />

        {/* AI Analysis Panel */}
        <AIAnalysisPanel 
          isOpen={showAIAnalysis} 
          onClose={() => {
            setShowAIAnalysis(false);
            setSelectedCustomerForAI(null);
          }}
          customer={selectedCustomerForAI}
        />

        {/* Factory Info Panel */}
        <FactoryInfoPanel 
          isOpen={showFactoryInfo} 
          onClose={() => {
            setShowFactoryInfo(false);
            setSelectedCustomerForFactory(null);
          }}
          customer={selectedCustomerForFactory}
        />
      </div>
    </div>
  );
};

export default RecordsList;