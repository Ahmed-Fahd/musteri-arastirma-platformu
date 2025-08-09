import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { CustomerFormData } from '../types/Customer';

export interface ImportResult {
  success: boolean;
  data?: CustomerFormData[];
  errors?: string[];
  totalRows?: number;
  validRows?: number;
}

export class ImportService {
  // Excel Import
  static async importFromExcel(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const result = this.processImportData(jsonData);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            errors: ['Excel dosyası okunamadı: ' + (error as Error).message]
          });
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  // CSV Import
  static async importFromCSV(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        encoding: 'UTF-8',
        complete: (results) => {
          if (results.errors.length > 0) {
            resolve({
              success: false,
              errors: results.errors.map(err => err.message)
            });
            return;
          }
          
          const result = this.processImportData(results.data);
          resolve(result);
        },
        error: (error) => {
          resolve({
            success: false,
            errors: ['CSV dosyası okunamadı: ' + error.message]
          });
        }
      });
    });
  }

  // JSON Backup Import
  static async importFromBackup(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const backup = JSON.parse(jsonString);
          
          if (!backup.customers || !Array.isArray(backup.customers)) {
            resolve({
              success: false,
              errors: ['Geçersiz backup dosyası formatı']
            });
            return;
          }
          
          const validCustomers: CustomerFormData[] = [];
          const errors: string[] = [];
          
          backup.customers.forEach((customer: any, index: number) => {
            const validation = this.validateCustomerData(customer, index + 1);
            if (validation.isValid && validation.data) {
              validCustomers.push(validation.data);
            } else {
              errors.push(...validation.errors);
            }
          });
          
          resolve({
            success: validCustomers.length > 0,
            data: validCustomers,
            errors: errors.length > 0 ? errors : undefined,
            totalRows: backup.customers.length,
            validRows: validCustomers.length
          });
        } catch (error) {
          resolve({
            success: false,
            errors: ['JSON dosyası okunamadı: ' + (error as Error).message]
          });
        }
      };
      
      reader.readAsText(file);
    });
  }

  // Process imported data
  private static processImportData(data: any[]): ImportResult {
    const validCustomers: CustomerFormData[] = [];
    const errors: string[] = [];
    
    data.forEach((row: any, index: number) => {
      const validation = this.validateImportRow(row, index + 1);
      if (validation.isValid && validation.data) {
        validCustomers.push(validation.data);
      } else {
        errors.push(...validation.errors);
      }
    });
    
    return {
      success: validCustomers.length > 0,
      data: validCustomers,
      errors: errors.length > 0 ? errors : undefined,
      totalRows: data.length,
      validRows: validCustomers.length
    };
  }

  // Validate import row
  private static validateImportRow(row: any, rowNumber: number): {
    isValid: boolean;
    data?: CustomerFormData;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Map different possible column names
    const country = this.getFieldValue(row, ['Ülke', 'Country', 'ülke', 'country']);
    const companyName = this.getFieldValue(row, ['Firma Adı', 'Company Name', 'firma_adi', 'company_name', 'Firma']);
    const website = this.getFieldValue(row, ['Web Sitesi', 'Website', 'web_sitesi', 'website']);
    const sector = this.getFieldValue(row, ['Sektör', 'Sector', 'sektor', 'sector']);
    const interestStatus = this.getFieldValue(row, ['İlgi Durumu', 'Interest Status', 'ilgi_durumu', 'interest_status']);
    const priority = this.getFieldValue(row, ['Öncelik', 'Priority', 'oncelik', 'priority']);
    const actionNote = this.getFieldValue(row, ['Aksiyon Notu', 'Action Note', 'aksiyon_notu', 'action_note']);
    const followUpStatus = this.getFieldValue(row, ['Takip Durumu', 'Follow Up Status', 'takip_durumu', 'follow_up_status']);

    // Validate required fields
    if (!country) {
      errors.push(`Satır ${rowNumber}: Ülke alanı zorunludur`);
    }
    
    if (!companyName) {
      errors.push(`Satır ${rowNumber}: Firma Adı alanı zorunludur`);
    }
    
    if (!sector) {
      errors.push(`Satır ${rowNumber}: Sektör alanı zorunludur`);
    }
    
    if (!actionNote) {
      errors.push(`Satır ${rowNumber}: Aksiyon Notu alanı zorunludur`);
    }

    // Validate enum values
    const normalizedInterest = this.normalizeInterestStatus(interestStatus);
    if (interestStatus && !normalizedInterest) {
      errors.push(`Satır ${rowNumber}: Geçersiz İlgi Durumu (Evet/Hayır veya Yes/No olmalı)`);
    }

    const normalizedPriority = this.normalizePriority(priority);
    if (priority && !normalizedPriority) {
      errors.push(`Satır ${rowNumber}: Geçersiz Öncelik (Yüksek/Orta/Düşük veya High/Medium/Low olmalı)`);
    }

    const normalizedFollowUp = this.normalizeFollowUpStatus(followUpStatus);
    if (followUpStatus && !normalizedFollowUp) {
      errors.push(`Satır ${rowNumber}: Geçersiz Takip Durumu`);
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    const customerData: CustomerFormData = {
      country: country || '',
      companyName: companyName || '',
      website: website || '',
      sector: sector || '',
      interestStatus: normalizedInterest || 'yes',
      priority: normalizedPriority || 'medium',
      actionNote: actionNote || '',
      followUpStatus: normalizedFollowUp || 'none'
    };

    return { isValid: true, data: customerData, errors: [] };
  }

  // Validate customer data for backup import
  private static validateCustomerData(customer: any, rowNumber: number): {
    isValid: boolean;
    data?: CustomerFormData;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!customer.companyName) {
      errors.push(`Müşteri ${rowNumber}: Firma Adı zorunludur`);
    }
    
    if (!customer.country) {
      errors.push(`Müşteri ${rowNumber}: Ülke zorunludur`);
    }
    
    if (!customer.sector) {
      errors.push(`Müşteri ${rowNumber}: Sektör zorunludur`);
    }
    
    if (!customer.actionNote) {
      errors.push(`Müşteri ${rowNumber}: Aksiyon Notu zorunludur`);
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    const customerData: CustomerFormData = {
      country: customer.country,
      companyName: customer.companyName,
      website: customer.website || '',
      sector: customer.sector,
      interestStatus: customer.interestStatus || 'yes',
      priority: customer.priority || 'medium',
      actionNote: customer.actionNote,
      followUpStatus: customer.followUpStatus || 'none'
    };

    return { isValid: true, data: customerData, errors: [] };
  }

  // Helper methods
  private static getFieldValue(row: any, possibleKeys: string[]): string {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null) {
        return String(row[key]).trim();
      }
    }
    return '';
  }

  private static normalizeInterestStatus(value: string): 'yes' | 'no' | null {
    if (!value) return null;
    const normalized = value.toLowerCase().trim();
    if (['evet', 'yes', '1', 'true'].includes(normalized)) return 'yes';
    if (['hayır', 'hayir', 'no', '0', 'false'].includes(normalized)) return 'no';
    return null;
  }

  private static normalizePriority(value: string): 'high' | 'medium' | 'low' | null {
    if (!value) return null;
    const normalized = value.toLowerCase().trim();
    if (['yüksek', 'yuksek', 'high'].includes(normalized)) return 'high';
    if (['orta', 'medium'].includes(normalized)) return 'medium';
    if (['düşük', 'dusuk', 'low'].includes(normalized)) return 'low';
    return null;
  }

  private static normalizeFollowUpStatus(value: string): 'first-follow' | 'second-follow' | 'none' | null {
    if (!value) return null;
    const normalized = value.toLowerCase().trim();
    if (['1. takip', '1 takip', 'first-follow', 'first follow'].includes(normalized)) return 'first-follow';
    if (['2. takip', '2 takip', 'second-follow', 'second follow'].includes(normalized)) return 'second-follow';
    if (['yok', 'none', 'no follow'].includes(normalized)) return 'none';
    return null;
  }

  // Generate template files
  static generateExcelTemplate(): void {
    const templateData = [
      {
        'Ülke': 'Suudi Arabistan',
        'Firma Adı': 'Örnek Şirket A.Ş.',
        'Web Sitesi': 'https://www.ornek.com',
        'Sektör': 'İnşaat',
        'İlgi Durumu': 'Evet',
        'Öncelik': 'Yüksek',
        'Aksiyon Notu': 'İlk görüşme yapıldı, teknik detaylar paylaşıldı',
        'Takip Durumu': '1. Takip'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Müşteri Şablonu');
    
    // Add comments/instructions
    const instructions = [
      ['KULLANIM TALİMATLARI:'],
      ['1. Bu şablonu doldurun'],
      ['2. İlgi Durumu: Evet/Hayır'],
      ['3. Öncelik: Yüksek/Orta/Düşük'],
      ['4. Takip Durumu: 1. Takip/2. Takip/Yok'],
      ['5. Dosyayı kaydedin ve içe aktarın']
    ];
    
    const instructionWs = XLSX.utils.aoa_to_sheet(instructions);
    XLSX.utils.book_append_sheet(wb, instructionWs, 'Talimatlar');
    
    XLSX.writeFile(wb, 'tradescout_musteri_sablonu.xlsx');
  }

  static generateCSVTemplate(): void {
    const templateData = [
      {
        'Ülke': 'Suudi Arabistan',
        'Firma Adı': 'Örnek Şirket A.Ş.',
        'Web Sitesi': 'https://www.ornek.com',
        'Sektör': 'İnşaat',
        'İlgi Durumu': 'Evet',
        'Öncelik': 'Yüksek',
        'Aksiyon Notu': 'İlk görüşme yapıldı, teknik detaylar paylaşıldı',
        'Takip Durumu': '1. Takip'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tradescout_musteri_sablonu.csv';
    link.click();
  }
}