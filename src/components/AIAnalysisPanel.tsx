import React, { useState } from 'react';
import { AIAnalysisService, AnalysisRequest, AnalysisResult } from '../services/aiAnalysisService';
import { Customer } from '../types/Customer';
import { 
  Brain, 
  TrendingUp, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Lightbulb,
  X,
  Sparkles,
  BarChart3,
  Target,
  MessageSquare
} from 'lucide-react';

interface AIAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ isOpen, onClose, customer }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quickQuestion, setQuickQuestion] = useState('');
  const [quickAnswer, setQuickAnswer] = useState('');
  const [isQuickAnalyzing, setIsQuickAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleFullAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysisRequest: AnalysisRequest = {
        companyName: customer.companyName,
        country: customer.country,
        sector: customer.sector,
        website: customer.website,
        interestStatus: customer.interestStatus,
        priority: customer.priority,
        actionNote: customer.actionNote,
        followUpStatus: customer.followUpStatus
      };

      const result = await AIAnalysisService.analyzeCompany(analysisRequest);
      setAnalysis(result);
    } catch (error) {
      alert('AI analizi sırasında hata oluştu. API anahtarınızı kontrol edin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickQuestion = async () => {
    if (!quickQuestion.trim()) return;
    
    setIsQuickAnalyzing(true);
    try {
      const analysisRequest: AnalysisRequest = {
        companyName: customer.companyName,
        country: customer.country,
        sector: customer.sector,
        website: customer.website,
        interestStatus: customer.interestStatus,
        priority: customer.priority,
        actionNote: customer.actionNote,
        followUpStatus: customer.followUpStatus
      };

      const answer = await AIAnalysisService.quickAnalysis(quickQuestion, analysisRequest);
      setQuickAnswer(answer);
    } catch (error) {
      setQuickAnswer('Analiz sırasında hata oluştu.');
    } finally {
      setIsQuickAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Yüksek Potansiyel';
    if (score >= 60) return 'Orta Potansiyel';
    return 'Düşük Potansiyel';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Analiz Merkezi
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{customer.companyName} - Akıllı Analiz</p>
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
          {/* Quick Question Section */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Hızlı Soru Sor
            </h3>
            <div className="flex space-x-3">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="Örn: Bu firma Türkiye pazarı için uygun mu?"
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickQuestion()}
              />
              <button
                onClick={handleQuickQuestion}
                disabled={isQuickAnalyzing || !quickQuestion.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isQuickAnalyzing ? 'Analiz...' : 'Sor'}
              </button>
            </div>
            {quickAnswer && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-200">{quickAnswer}</p>
              </div>
            )}
          </div>

          {/* Full Analysis Button */}
          {!analysis && (
            <div className="text-center mb-8">
              <button
                onClick={handleFullAnalysis}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors mx-auto"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>AI Analizi Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Tam AI Analizi Başlat</span>
                  </>
                )}
              </button>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Kapsamlı analiz 30-60 saniye sürebilir
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Genel Değerlendirme
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">AI destekli potansiyel analizi</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}/100
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {getScoreText(analysis.overallScore)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Country Analysis */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Ülke Analizi</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {analysis.countryAnalysis}
                  </p>
                </div>

                {/* Sector Trends */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sektör Trendleri</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {analysis.sectorTrends}
                  </p>
                </div>

                {/* Turkey Market Fit */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-6 h-6 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Türkiye Pazar Uyumu</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {analysis.turkeyMarketFit}
                  </p>
                </div>

                {/* Risk Assessment */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Risk Değerlendirmesi</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {analysis.riskAssessment}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">AI Önerileri</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {analysis.recommendations}
                </p>
                
                {/* Next Actions */}
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Sonraki Adımlar:</h5>
                  <ul className="space-y-2">
                    {analysis.nextActions.map((action, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certification Analysis */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Sertifika Analizi</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {analysis.certificationAnalysis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;