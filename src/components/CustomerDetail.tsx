import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { useLanguage } from '../contexts/LanguageContext';
import { CustomerFormData } from '../types/Customer';
import { countries } from '../data/countries';
import { sectors } from '../data/sectors';
import { ArrowLeft, Save, Edit, Globe, Building, Link as LinkIcon, Briefcase, Heart, AlertTriangle, FileText, Clock, ExternalLink } from 'lucide-react';

const CustomerDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { customers, updateCustomer } = useCustomers();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customer = customers.find(c => c.id === id);

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

  // Müşteri verisi yüklendiğinde form verilerini güncelle
  React.useEffect(() => {
    if (customer) {
      setFormData({
        country: customer.country,
        companyName: customer.companyName,
        website: customer.website || '',
        sector: customer.sector,
        interestStatus: customer.interestStatus,
        priority: customer.priority,
        actionNote: customer.actionNote,
        followUpStatus: customer.followUpStatus
      });
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 mb-6">
            Müşteri bulunamadı.
          </p>
          <button
            onClick={() => navigate('/records')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {t('records.title')}
          </button>
        </div>
      </div>
    );
  }

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
      await updateCustomer(customer.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/records')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('records.title')}</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{customer.companyName}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{customer.country}</span>
                <span>•</span>
                <span>{customer.sector}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(customer.priority)}`}>
                {getPriorityText(customer.priority)}
              </span>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>{t('records.edit')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Country */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Globe className="w-4 h-4" />
                  <span>{t('form.country')} *</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.country ? 'border-red-300' : 'border-gray-200'
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
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Building className="w-4 h-4" />
                  <span>{t('form.companyName')} *</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder={t('form.companyNamePlaceholder')}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.companyName ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-2">{errors.companyName}</p>}
              </div>

              {/* Website */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <LinkIcon className="w-4 h-4" />
                  <span>{t('form.website')}</span>
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder={t('form.websitePlaceholder')}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.website ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.website && <p className="text-red-500 text-sm mt-2">{errors.website}</p>}
              </div>

              {/* Sector */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Briefcase className="w-4 h-4" />
                  <span>{t('form.sector')} *</span>
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.sector ? 'border-red-300' : 'border-gray-200'
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
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
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
                    <span className="ml-2">{t('form.yes')}</span>
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
                    <span className="ml-2">{t('form.no')}</span>
                  </label>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t('form.priority')}</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="high">{t('form.high')}</option>
                  <option value="medium">{t('form.medium')}</option>
                  <option value="low">{t('form.low')}</option>
                </select>
              </div>

              {/* Follow Up Status */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{t('form.followUpStatus')}</span>
                </label>
                <select
                  value={formData.followUpStatus}
                  onChange={(e) => handleChange('followUpStatus', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="none">{t('form.noFollow')}</option>
                  <option value="first-follow">{t('form.firstFollow')}</option>
                  <option value="second-follow">{t('form.secondFollow')}</option>
                </select>
              </div>

              {/* Action Note */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText className="w-4 h-4" />
                  <span>{t('form.actionNote')} *</span>
                </label>
                <textarea
                  value={formData.actionNote}
                  onChange={(e) => handleChange('actionNote', e.target.value)}
                  placeholder={t('form.actionNotePlaceholder')}
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none ${
                    errors.actionNote ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.actionNote && <p className="text-red-500 text-sm mt-2">{errors.actionNote}</p>}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Form verilerini orijinal müşteri verilerine geri döndür
                  if (customer) {
                    setFormData({
                      country: customer.country,
                      companyName: customer.companyName,
                      website: customer.website || '',
                      sector: customer.sector,
                      interestStatus: customer.interestStatus,
                      priority: customer.priority,
                      actionNote: customer.actionNote,
                      followUpStatus: customer.followUpStatus
                    });
                  }
                  setErrors({});
                }}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                {t('form.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? t('form.saving') : t('form.save')}</span>
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <span className="text-sm font-medium text-gray-500">{t('form.country')}</span>
                <p className="text-lg text-gray-900 mt-1">{customer.country}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">{t('form.companyName')}</span>
                <p className="text-lg text-gray-900 mt-1">{customer.companyName}</p>
              </div>
              {customer.website && (
                <div>
                  <span className="text-sm font-medium text-gray-500">{t('form.website')}</span>
                  <a
                    href={customer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors mt-1"
                  >
                    <span>{customer.website}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-500">{t('form.sector')}</span>
                <p className="text-lg text-gray-900 mt-1">{customer.sector}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">{t('form.interestStatus')}</span>
                <p className="text-lg text-gray-900 mt-1">{getInterestText(customer.interestStatus)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">{t('form.priority')}</span>
                <p className="text-lg text-gray-900 mt-1">{getPriorityText(customer.priority)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">{t('form.followUpStatus')}</span>
                <p className="text-lg text-gray-900 mt-1">{getFollowUpText(customer.followUpStatus)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">{t('records.createdAt')}</span>
                <p className="text-lg text-gray-900 mt-1">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {customer.actionNote && (
              <div className="bg-gray-50 rounded-lg p-6">
                <span className="text-sm font-medium text-gray-500 block mb-2">{t('form.actionNote')}</span>
                <p className="text-gray-800 leading-relaxed">{customer.actionNote}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;