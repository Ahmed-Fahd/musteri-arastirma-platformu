import { Customer } from '../types/Customer';

export interface FactoryInfo {
  companyName: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: string;
    timezone: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    socialMedia: string[];
    languages: string[];
  };
  financial: {
    estimatedRevenue: string;
    employeeCount: string;
    foundingYear: string;
    marketCap: string;
    creditRating: string;
    paymentTerms: string;
  };
  operational: {
    productionCapacity: string;
    certifications: string[];
    exportMarkets: string[];
    mainProducts: string[];
  };
}

export class FactoryInfoService {
  // Gemini API ile fabrika bilgilerini al
  static async getFactoryInfo(customer: Customer): Promise<FactoryInfo> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API anahtarı yapılandırılmamış');
    }

    const prompt = this.generateFactoryInfoPrompt(customer);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return this.parseFactoryInfo(customer, aiResponse);
    } catch (error) {
      console.error('Factory Info Error:', error);
      throw new Error('Fabrika bilgileri alınırken hata oluştu');
    }
  }

  // Fabrika bilgi promptu oluştur
  private static generateFactoryInfoPrompt(customer: Customer): string {
    return `
Sen bir iş zekası uzmanısın. ${customer.companyName} firması hakkında aşağıdaki kategorilerde bilgi ver:

KONUM BİLGİLERİ:
- Tam adres (tahmin)
- Şehir ve ülke: ${customer.country}
- Koordinatlar (enlem/boylam)
- Saat dilimi
- Bölgesel özellikler

İLETİŞİM BİLGİLERİ:
- Telefon numarası (ülke kodu ile)
- E-posta adresi (tahmin)
- Web sitesi: ${customer.website || 'Bilinmiyor'}
- Sosyal medya hesapları
- Konuşulan diller

MALİ DURUM:
- Tahmini yıllık ciro (USD)
- Çalışan sayısı
- Kuruluş yılı (tahmin)
- Pazar değeri
- Kredi notu (tahmin)
- Ödeme koşulları

OPERASYONEL BİLGİLER:
- Üretim kapasitesi
- Sahip olduğu sertifikalar
- İhracat yaptığı ülkeler
- Ana ürünler: ${customer.sector} sektörü

Lütfen gerçekçi tahminler yap ve "Tahmin" kelimesini kullan. JSON formatında değil, düz metin olarak ver.
    `;
  }

  // AI yanıtını parse et
  private static parseFactoryInfo(customer: Customer, aiResponse: string): FactoryInfo {
    // AI yanıtından bilgileri çıkar (basit parsing)
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    return {
      companyName: customer.companyName,
      location: {
        address: this.extractInfo(lines, ['adres', 'address']) || `${customer.country} merkezli`,
        city: this.extractInfo(lines, ['şehir', 'city']) || 'Bilinmiyor',
        country: customer.country,
        coordinates: this.extractInfo(lines, ['koordinat', 'coordinates']) || 'Bilinmiyor',
        timezone: this.extractInfo(lines, ['saat', 'timezone']) || 'Bilinmiyor'
      },
      contact: {
        phone: this.extractInfo(lines, ['telefon', 'phone']) || 'Bilinmiyor',
        email: this.extractInfo(lines, ['email', 'e-posta']) || 'Bilinmiyor',
        website: customer.website || 'Bilinmiyor',
        socialMedia: this.extractArray(lines, ['sosyal', 'social']),
        languages: this.extractArray(lines, ['dil', 'language'])
      },
      financial: {
        estimatedRevenue: this.extractInfo(lines, ['ciro', 'revenue']) || 'Bilinmiyor',
        employeeCount: this.extractInfo(lines, ['çalışan', 'employee']) || 'Bilinmiyor',
        foundingYear: this.extractInfo(lines, ['kuruluş', 'founding']) || 'Bilinmiyor',
        marketCap: this.extractInfo(lines, ['pazar değeri', 'market cap']) || 'Bilinmiyor',
        creditRating: this.extractInfo(lines, ['kredi', 'credit']) || 'Bilinmiyor',
        paymentTerms: this.extractInfo(lines, ['ödeme', 'payment']) || 'Bilinmiyor'
      },
      operational: {
        productionCapacity: this.extractInfo(lines, ['kapasite', 'capacity']) || 'Bilinmiyor',
        certifications: this.extractArray(lines, ['sertifika', 'certification']),
        exportMarkets: this.extractArray(lines, ['ihracat', 'export']),
        mainProducts: this.extractArray(lines, ['ürün', 'product'])
      }
    };
  }

  // Metin içinden bilgi çıkar
  private static extractInfo(lines: string[], keywords: string[]): string {
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      for (const keyword of keywords) {
        if (lowerLine.includes(keyword)) {
          // ":" dan sonrasını al
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            return line.substring(colonIndex + 1).trim();
          }
          // "-" dan sonrasını al
          const dashIndex = line.indexOf('-');
          if (dashIndex !== -1) {
            return line.substring(dashIndex + 1).trim();
          }
        }
      }
    }
    return '';
  }

  // Array bilgilerini çıkar
  private static extractArray(lines: string[], keywords: string[]): string[] {
    const info = this.extractInfo(lines, keywords);
    if (!info) return [];
    
    return info.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }

  // Hızlı fabrika özeti
  static async getQuickFactorySummary(customer: Customer): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return `${customer.companyName} hakkında detaylı bilgi için Gemini API anahtarı gerekli.`;
    }

    const prompt = `
${customer.companyName} firması (${customer.country} - ${customer.sector}) hakkında 3-4 cümlelik özet:
- Konum ve büyüklük
- Mali durum tahmini
- İletişim durumu
- Yatırım potansiyeli

Kısa ve net ol.
    `;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 200 }
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Özet oluşturulamadı';
    } catch (error) {
      return 'Özet oluşturulurken hata oluştu';
    }
  }
}