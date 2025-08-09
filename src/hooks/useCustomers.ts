import { useState, useEffect } from 'react';
import { Customer, CustomerFormData } from '../types/Customer';
import { CustomerService } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customers from Supabase on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Müşteriler yüklenirken hata oluştu');
      
      // Fallback to localStorage if Supabase fails
      const savedCustomers = localStorage.getItem('tradescout-customers');
      if (savedCustomers) {
        try {
          const parsed = JSON.parse(savedCustomers);
          setCustomers(parsed);
        } catch (parseError) {
          console.error('Error parsing saved customers:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (formData: CustomerFormData): Promise<void> => {
    try {
      setError(null);
      const newCustomer = await CustomerService.addCustomer(formData);
      setCustomers(prev => [newCustomer, ...prev]);
      
      // Also save to localStorage as backup
      const updatedCustomers = [newCustomer, ...customers];
      localStorage.setItem('tradescout-customers', JSON.stringify(updatedCustomers));
    } catch (err) {
      console.error('Error adding customer:', err);
      setError('Müşteri eklenirken hata oluştu');
      
      // Fallback to localStorage
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        companyName: formData.companyName,
        country: formData.country,
        website: formData.website,
        sector: formData.sector,
        interestStatus: formData.interestStatus,
        priority: formData.priority,
        actionNote: formData.actionNote,
        followUpStatus: formData.followUpStatus,
        createdAt: new Date()
      };
      
      setCustomers(prev => [newCustomer, ...prev]);
      localStorage.setItem('tradescout-customers', JSON.stringify([newCustomer, ...customers]));
    }

    // Simulate async operation
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  const updateCustomer = async (id: string, formData: CustomerFormData): Promise<void> => {
    try {
      setError(null);
      const updatedCustomer = await CustomerService.updateCustomer(id, formData);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
      
      // Also update localStorage
      const updatedCustomers = customers.map(customer => 
        customer.id === id ? updatedCustomer : customer
      );
      localStorage.setItem('tradescout-customers', JSON.stringify(updatedCustomers));
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Müşteri güncellenirken hata oluştu');
      
      // Fallback to localStorage
      setCustomers(prev => prev.map(customer => 
        customer.id === id 
          ? { 
              ...customer, 
              companyName: formData.companyName,
              country: formData.country,
              website: formData.website,
              sector: formData.sector,
              interestStatus: formData.interestStatus,
              priority: formData.priority,
              actionNote: formData.actionNote,
              followUpStatus: formData.followUpStatus
            }
          : customer
      ));
    }
    
    // Simulate async operation
    return new Promise(resolve => setTimeout(resolve, 500));
  };
  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      setError(null);
      await CustomerService.deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      // Also update localStorage
      const updatedCustomers = customers.filter(customer => customer.id !== id);
      localStorage.setItem('tradescout-customers', JSON.stringify(updatedCustomers));
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Müşteri silinirken hata oluştu');
      
      // Fallback to localStorage
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      const updatedCustomers = customers.filter(customer => customer.id !== id);
      localStorage.setItem('tradescout-customers', JSON.stringify(updatedCustomers));
    }
  };

  const getCustomerById = (id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id);
  };

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    refreshCustomers: loadCustomers
  };
};