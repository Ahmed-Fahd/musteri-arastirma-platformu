import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Users, Heart, AlertTriangle, Clock, TrendingUp, Globe, Building, Bot } from 'lucide-react';
import AIAnalysisPanel from './AIAnalysisPanel';
import FactoryInfoPanel from './FactoryInfoPanel';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import ReportBotPanel from './ReportBotPanel';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { t } = useLanguage();
  const [showReportBot, setShowReportBot] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showFactoryInfo, setShowFactoryInfo] = useState(false);
  const [selectedCustomerForAI, setSelectedCustomerForAI] = useState<any>(null);

  const stats = useMemo(() => {
    const total = customers.length;
    const interested = customers.filter(c => c.interestStatus === 'yes').length;
    const highPriority = customers.filter(c => c.priority === 'high').length;
    const inFollowUp = customers.filter(c => c.followUpStatus !== 'none').length;

    return { total, interested, highPriority, inFollowUp };
  }, [customers]);

  const countryData = useMemo(() => {
    const countryCount = customers.reduce((acc, customer) => {
      acc[customer.country] = (acc[customer.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryCount)
      .map(([country, count]) => ({ name: country, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [customers]);

  const sectorData = useMemo(() => {
    const sectorCount = customers.reduce((acc, customer) => {
      acc[customer.sector] = (acc[customer.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sectorCount)
      .map(([sector, count]) => ({ name: sector, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [customers]);

  const priorityData = useMemo(() => {
    const priorityCount = customers.reduce((acc, customer) => {
      const priority = customer.priority === 'high' ? t('form.high') : 
                     customer.priority === 'medium' ? t('form.medium') : t('form.low');
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(priorityCount).map(([priority, count]) => ({ name: priority, value: count }));
  }, [customers, t]);

  const monthlyData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: startOfMonth(subMonths(new Date(), 5)),
      end: endOfMonth(new Date())
    });

    return last6Months.map(month => {
      const monthCustomers = customers.filter(customer => {
        const customerDate = new Date(customer.createdAt);
        return customerDate >= startOfMonth(month) && customerDate <= endOfMonth(month);
      });

      return {
        month: format(month, 'MMM'),
        customers: monthCustomers.length,
        interested: monthCustomers.filter(c => c.interestStatus === 'yes').length
      };
    });
  }, [customers]);

  const recentCustomers = useMemo(() => {
    return customers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [customers]);

  const COLORS = ['#059669', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

  if (customers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.backToHome')}</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('dashboard.noData')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('dashboard.noDataDesc')}
            </p>
            <button
              onClick={() => navigate('/add-customer')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t('landing.addCustomer')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('dashboard.overview')}</p>
          <div className="mt-4">
            <button
              onClick={() => setShowReportBot(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Özet Rapor Oluştur</span>
            </button>
            <button
              onClick={() => setShowAIAnalysis(true)}
              className="ml-3 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>AI Pazar Analizi</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.totalCustomers')}</h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interested}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.interestedCustomers')}</h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.highPriority')}</h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inFollowUp}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.inFollowUp')}</h3>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Country Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.countryDistribution')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.sectorDistribution')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.monthlyTrend')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#059669" strokeWidth={2} name={t('common.customers')} />
                  <Line type="monotone" dataKey="interested" stroke="#0ea5e9" strokeWidth={2} name={t('dashboard.interestedCustomers')} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.priorityDistribution')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.recentActivity')}</h3>
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{customer.companyName}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="w-3 h-3" />
                    <span>{customer.country}</span>
                    <span>•</span>
                    <span>{customer.sector}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Bot Panel */}
        <ReportBotPanel 
          isOpen={showReportBot} 
          onClose={() => setShowReportBot(false)}
        />

        {/* AI Analysis Panel */}
        {showAIAnalysis && (
          <AIAnalysisPanel 
            isOpen={showAIAnalysis} 
            onClose={() => setShowAIAnalysis(false)}
            customer={selectedCustomerForAI || customers[0]}
          />
        )}

        {/* Factory Info Panel */}
        {showFactoryInfo && customers.length > 0 && (
          <FactoryInfoPanel 
            isOpen={showFactoryInfo} 
            onClose={() => setShowFactoryInfo(false)}
            customer={customers[0]}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;