import { supabase } from '../lib/supabase';
import { Customer, CustomerFormData } from '../types/Customer';

export class CustomerService {
  // Tüm müşterileri getir
  static async getAllCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Müşteriler getirilirken hata:', error);
        throw error;
      }

      // Database formatından uygulama formatına dönüştür
      return data.map(this.mapDatabaseToCustomer);
    } catch (error) {
      console.error('getAllCustomers error:', error);
      throw error;
    }
  }

  // Yeni müşteri ekle
  static async addCustomer(formData: CustomerFormData): Promise<Customer> {
    try {
      const customerData = {
        country: formData.country,
        company_name: formData.companyName,
        website: formData.website || null,
        sector: formData.sector,
        interest_status: formData.interestStatus,
        priority: formData.priority,
        action_note: formData.actionNote,
        follow_up_status: formData.followUpStatus
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) {
        console.error('Müşteri eklenirken hata:', error);
        throw error;
      }

      return this.mapDatabaseToCustomer(data);
    } catch (error) {
      console.error('addCustomer error:', error);
      throw error;
    }
  }

  // Müşteri güncelle
  static async updateCustomer(id: string, formData: CustomerFormData): Promise<Customer> {
    try {
      const customerData = {
        country: formData.country,
        company_name: formData.companyName,
        website: formData.website || null,
        sector: formData.sector,
        interest_status: formData.interestStatus,
        priority: formData.priority,
        action_note: formData.actionNote,
        follow_up_status: formData.followUpStatus
      };

      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Müşteri güncellenirken hata:', error);
        throw error;
      }

      return this.mapDatabaseToCustomer(data);
    } catch (error) {
      console.error('updateCustomer error:', error);
      throw error;
    }
  }

  // Müşteri sil
  static async deleteCustomer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Müşteri silinirken hata:', error);
        throw error;
      }
    } catch (error) {
      console.error('deleteCustomer error:', error);
      throw error;
    }
  }

  // ID ile müşteri getir
  static async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Kayıt bulunamadı
          return null;
        }
        console.error('Müşteri getirilirken hata:', error);
        throw error;
      }

      return this.mapDatabaseToCustomer(data);
    } catch (error) {
      console.error('getCustomerById error:', error);
      throw error;
    }
  }

  // Filtrelenmiş müşteri arama
  static async searchCustomers(filters: {
    searchTerm?: string;
    country?: string;
    sector?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Customer[]> {
    try {
      let query = supabase
        .from('customers')
        .select('*');

      // Firma adı araması
      if (filters.searchTerm) {
        query = query.ilike('company_name', `%${filters.searchTerm}%`);
      }

      // Ülke filtresi
      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      // Sektör filtresi
      if (filters.sector) {
        query = query.eq('sector', filters.sector);
      }

      // Öncelik filtresi
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      // Tarih aralığı filtresi
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo + 'T23:59:59');
      }

      // Tarihe göre sırala (en yeni önce)
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Müşteri araması sırasında hata:', error);
        throw error;
      }

      return data.map(this.mapDatabaseToCustomer);
    } catch (error) {
      console.error('searchCustomers error:', error);
      throw error;
    }
  }

  // Database formatından uygulama formatına dönüştürme
  private static mapDatabaseToCustomer(dbCustomer: any): Customer {
    return {
      id: dbCustomer.id,
      country: dbCustomer.country,
      companyName: dbCustomer.company_name,
      website: dbCustomer.website,
      sector: dbCustomer.sector,
      interestStatus: dbCustomer.interest_status,
      priority: dbCustomer.priority,
      actionNote: dbCustomer.action_note,
      followUpStatus: dbCustomer.follow_up_status,
      createdAt: new Date(dbCustomer.created_at)
    };
  }

  // Veritabanı bağlantısını test et
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Veritabanı bağlantı testi başarısız:', error);
      return false;
    }
  }

  // İstatistikler için özel sorgular
  static async getStatistics() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('interest_status, priority, follow_up_status, country, sector, created_at');

      if (error) {
        console.error('İstatistikler getirilirken hata:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('getStatistics error:', error);
      throw error;
    }
  }
}