import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerFormData } from '../types/Customer';
import { countries } from '../data/countries';
import { sectors } from '../data/sectors';
import { useCustomers } from '../hooks/useCustomers';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import { Save, ArrowLeft, Globe, Building, Link as LinkIcon, Briefcase, Heart, AlertTriangle, FileText, Clock } from 'lucide-react';

const CustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const { addCustomer, error } = useCustomers();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    country: '',
    companyName: '',
    website: '',
    sector: '',
    interestStatus: 'yes',
    priority: 'medium',
    actionNote: '',
    followUpStatus: 'none'
  });

  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    if (!formData.country) newErrors.country = t('form.country') + ' ' + t('common.required');
    if (!formData.companyName.trim()) newErrors.companyName = t('form.companyName') + ' ' + t('common.required');
    if (!formData.sector) newErrors.sector = t('form.sector') + ' ' + t('common.required');
    if (!formData.actionNote.trim()) newErrors.actionNote = t('form.actionNote') + ' ' + t('common.required');

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Geçerli bir URL girin (http:// veya https:// ile başlamalı)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await addCustomer(formData);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          country: '',
          companyName: '',
          website: '',
          sector: '',
          interestStatus: 'yes',
          priority: 'medium',
          actionNote: '',
          followUpStatus: 'none'
        });
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Müşteri eklenirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOld = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await addCustomer(formData);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          country: '',
          companyName: '',
          website: '',
          sector: '',
          interestStatus: 'yes',
          priority: 'medium',
          actionNote: '',
          followUpStatus: 'none'
        });
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Save className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('form.success')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('form.successMessage')}
          </p>
          <button
            onClick={() => navigate('/records')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {t('form.viewRecords')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.backToHome')}</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('form.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('form.subtitle')}</p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">{error} - Veriler yerel olarak kaydedilecek</p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Country */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Globe className="w-4 h-4" />
                <span>{t('form.country')} *</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:text-white ${
                  errors.country ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <option value="">{t('form.countryPlaceholder')}</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-sm mt-2">{errors.country}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Building className="w-4 h-4" />
                <span>{t('form.companyName')} *</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder={t('form.companyNamePlaceholder')}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:text-white ${
                  errors.companyName ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-2">{errors.companyName}</p>}
            </div>

            {/* Website */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <LinkIcon className="w-4 h-4" />
                <span>{t('form.website')}</span>
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder={t('form.websitePlaceholder')}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:text-white ${
                  errors.website ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.website && <p className="text-red-500 text-sm mt-2">{errors.website}</p>}
            </div>

            {/* Sector */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Briefcase className="w-4 h-4" />
                <span>{t('form.sector')} *</span>
              </label>
              <select
                value={formData.sector}
                onChange={(e) => handleChange('sector', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:text-white ${
                  errors.sector ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <option value="">{t('form.sectorPlaceholder')}</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              {errors.sector && <p className="text-red-500 text-sm mt-2">{errors.sector}</p>}
            </div>

            {/* Interest Status */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Heart className="w-4 h-4" />
                <span>{t('form.interestStatus')}</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="interestStatus"
                    value="yes"
                    checked={formData.interestStatus === 'yes'}
                    onChange={(e) => handleChange('interestStatus', e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 dark:text-gray-300">{t('form.yes')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="interestStatus"
                    value="no"
                    checked={formData.interestStatus === 'no'}
                    onChange={(e) => handleChange('interestStatus', e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 dark:text-gray-300">{t('form.no')}</span>
                </label>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('form.priority')}</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:text-white"
              >
                <option value="high">{t('form.high')}</option>
                <option value="medium">{t('form.medium')}</option>
                <option value="low">{t('form.low')}</option>
              </select>
            </div>

            {/* Follow Up Status */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Clock className="w-4 h-4" />
                <span>{t('form.followUpStatus')}</span>
              </label>
              <select
                value={formData.followUpStatus}
                onChange={(e) => handleChange('followUpStatus', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors dark:bg-gray-700 dark:text-white"
              >
                <option value="none">{t('form.noFollow')}</option>
                <option value="first-follow">{t('form.firstFollow')}</option>
                <option value="second-follow">{t('form.secondFollow')}</option>
              </select>
            </div>

            {/* Action Note */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <FileText className="w-4 h-4" />
                <span>{t('form.actionNote')} *</span>
              </label>
              <textarea
                value={formData.actionNote}
                onChange={(e) => handleChange('actionNote', e.target.value)}
                placeholder={t('form.actionNotePlaceholder')}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none dark:bg-gray-700 dark:text-white ${
                  errors.actionNote ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.actionNote && <p className="text-red-500 text-sm mt-2">{errors.actionNote}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('form.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 dark:disabled:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSubmitting ? t('form.saving') : t('form.save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;