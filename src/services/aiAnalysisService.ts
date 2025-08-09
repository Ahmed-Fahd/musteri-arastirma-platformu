import OpenAI from 'openai';

// AI API yapılandırması
const getAIConfig = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  return {
    openai: apiKey && apiKey !== 'your_openai_api_key_here' ? apiKey : null,
    gemini: geminiKey && geminiKey !== 'your_gemini_api_key_here' ? geminiKey : null
  };
};

const getOpenAIClient = () => {
  const config = getAIConfig();
  
  if (!config.openai) {
    return null;
  }
  
  return new OpenAI({
    apiKey: config.openai,
    dangerouslyAllowBrowser: true // Client-side kullanım için
  });
};

export interface AnalysisRequest {
  companyName: string;
  country: string;
  sector: string;
  website?: string;
  interestStatus: string;
  priority: string;
  actionNote: string;
  followUpStatus: string;
}

export interface AnalysisResult {
  countryAnalysis: string;
  sectorTrends: string;
  turkeyMarketFit: string;
  certificationAnalysis: string;
  riskAssessment: string;
  recommendations: string;
  overallScore: number;
  nextActions: string[];
}

export class AIAnalysisService {
  // Ana analiz fonksiyonu
  static async analyzeCompany(data: AnalysisRequest): Promise<AnalysisResult> {
    const openai = getOpenAIClient();
    
    if (!openai) {
      throw new Error('OpenAI API anahtarı yapılandırılmamış. Lütfen .env dosyasında VITE_OPENAI_API_KEY değişkenini ayarlayın.');
    }
    
    try {
      const prompts = this.generatePrompts(data);
      const analyses = await Promise.all([
        this.askAI(prompts.countryAnalysis),
        this.askAI(prompts.sectorTrends),
        this.askAI(prompts.turkeyMarketFit),
        this.askAI(prompts.certificationAnalysis),
        this.askAI(prompts.riskAssessment),
        this.askAI(prompts.recommendations)
      ]);

      // Genel skor hesaplama
      const overallScore = this.calculateOverallScore(data, analyses);
      
      // Sonraki aksiyonlar
      const nextActions = this.generateNextActions(data, analyses);

      return {
        countryAnalysis: analyses[0],
        sectorTrends: analyses[1],
        turkeyMarketFit: analyses[2],
        certificationAnalysis: analyses[3],
        riskAssessment: analyses[4],
        recommendations: analyses[5],
        overallScore,
        nextActions
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('AI analizi sırasında hata oluştu');
    }
  }

  // GPT'ye soru sorma
  private static async askAI(prompt: string): Promise<string> {
    const config = getAIConfig();
    
    // Önce Gemini'yi dene
    if (config.gemini) {
      try {
        return await this.askGemini(prompt);
      } catch (error) {
        console.warn('Gemini API failed, trying OpenAI:', error);
      }
    }
    
    // Gemini başarısızsa OpenAI'yi dene
    if (config.openai) {
      try {
        return await this.askOpenAI(prompt);
      } catch (error) {
        console.warn('OpenAI API failed:', error);
      }
    }
    
    return "AI servisleri şu anda kullanılamıyor. Lütfen API anahtarlarınızı kontrol edin.";
  }

  // OpenAI'ye soru sorma
  private static async askOpenAI(prompt: string): Promise<string> {
    const openai = getOpenAIClient();
    
    if (!openai) {
      throw new Error("OpenAI API anahtarı yapılandırılmamış");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sen bir uluslararası ticaret ve yatırım uzmanısın. Türkçe yanıt ver. Kısa, net ve işlem odaklı analiz yap."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || "Analiz yapılamadı";
  }

  // Gemini'ye soru sorma
  private static async askGemini(prompt: string): Promise<string> {
    const config = getAIConfig();
    
    if (!config.gemini) {
      throw new Error("Gemini API anahtarı yapılandırılmamış");
    }

    const systemPrompt = "Sen bir uluslararası ticaret uzmanısın. Türkçe yanıt ver. Çok kısa, madde halinde, net analiz yap. Maksimum 4-5 madde.";
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': config.gemini
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Analiz yapılamadı";
  }

  // Prompt şablonları oluşturma
  private static generatePrompts(data: AnalysisRequest) {
    return {
      countryAnalysis: `
        ${data.country} - ${data.sector} sektörü için 3-4 madde halinde kısa analiz:
        • Ekonomik durum
        • Yatırım iklimi
        • Riskler
      `,
      
      sectorTrends: `
        ${data.country} - ${data.sector} sektörü için madde halinde:
        • Büyüme trendi
        • Fırsatlar
        • Teknoloji durumu
      `,
      
      turkeyMarketFit: `
        ${data.companyName} - Türkiye uyumu için kısa değerlendirme:
        • Pazar talebi
        • Gümrük durumu
        • Uygunluk skoru (1-10)
      `,
      
      certificationAnalysis: `
        ${data.sector} için gerekli sertifikalar (madde halinde):
        • AB için gerekenler
        • Türkiye için gerekenler
        • Eksik olanlar
      `,
      
      riskAssessment: `
        ${data.companyName} için kısa SWOT:
        • Güçlü yanlar (2 madde)
        • Zayıf yanlar (2 madde)
        • Fırsatlar (2 madde)
        • Tehditler (2 madde)
      `,
      
      recommendations: `
        ${data.companyName} için 3-4 madde halinde somut öneriler:
        • Hemen yapılacaklar
        • Orta vadeli planlar
        • Dikkat edilecekler
      `
    };
  }

  // Genel skor hesaplama
  private static calculateOverallScore(data: AnalysisRequest, analyses: string[]): number {
    let score = 50; // Başlangıç skoru

    // Ülke faktörü
    const stableCountries = ['Suudi Arabistan', 'BAE', 'Katar', 'Kuveyt', 'Malezya'];
    if (stableCountries.includes(data.country)) score += 15;

    // Sektör faktörü
    const growingSectors = ['Teknoloji', 'Sağlık', 'Gıda', 'Enerji'];
    if (growingSectors.includes(data.sector)) score += 10;

    // İlgi durumu
    if (data.interestStatus === 'yes') score += 15;

    // Öncelik
    if (data.priority === 'high') score += 10;
    else if (data.priority === 'medium') score += 5;

    // Takip durumu
    if (data.followUpStatus !== 'none') score += 10;

    // AI analiz sonuçlarından pozitif/negatif kelime analizi
    const allAnalyses = analyses.join(' ').toLowerCase();
    const positiveWords = ['fırsat', 'büyüme', 'potansiyel', 'uygun', 'olumlu', 'avantaj'];
    const negativeWords = ['risk', 'sorun', 'engel', 'olumsuz', 'dezavantaj', 'tehlike'];

    positiveWords.forEach(word => {
      if (allAnalyses.includes(word)) score += 2;
    });

    negativeWords.forEach(word => {
      if (allAnalyses.includes(word)) score -= 2;
    });

    return Math.max(0, Math.min(100, score));
  }

  // Sonraki aksiyonlar
  private static generateNextActions(data: AnalysisRequest, analyses: string[]): string[] {
    const actions: string[] = [];

    if (data.interestStatus === 'yes' && data.priority === 'high') {
      actions.push('Acil toplantı planla');
      actions.push('Detaylı teknik bilgi paylaş');
    }

    if (data.followUpStatus === 'none') {
      actions.push('İlk takip emaili gönder');
    } else if (data.followUpStatus === 'first-follow') {
      actions.push('İkinci takip araması yap');
    }

    if (data.website) {
      actions.push('Firma web sitesini detaylı incele');
    }

    // AI analizlerinden aksiyon çıkarma
    const allAnalyses = analyses.join(' ').toLowerCase();
    
    if (allAnalyses.includes('sertifika')) {
      actions.push('Sertifika durumunu kontrol et');
    }
    
    if (allAnalyses.includes('pazar')) {
      actions.push('Pazar araştırması yap');
    }

    if (allAnalyses.includes('risk')) {
      actions.push('Risk değerlendirmesi hazırla');
    }

    return actions.slice(0, 5); // En fazla 5 aksiyon
  }

  // Hızlı analiz (tek soru)
  static async quickAnalysis(question: string, companyData: AnalysisRequest): Promise<string> {
    const prompt = `
      Firma: ${companyData.companyName}
      Ülke: ${companyData.country}
      Sektör: ${companyData.sector}
      
      Soru: ${question}
      
      Kısa ve net yanıt ver.
    `;

    return await this.askAI(prompt);
  }

  // Pazar analizi
  static async marketAnalysis(country: string, sector: string): Promise<string> {
    const prompt = `
      ${country} ülkesinde ${sector} sektörünün 2025 yılı pazar durumu nasıl?
      Büyüme oranları, fırsatlar, tehditler ve Türk firmaları için potansiyel nedir?
    `;

    return await this.askAI(prompt);
  }

  // Rekabet analizi
  static async competitorAnalysis(country: string, sector: string): Promise<string> {
    const prompt = `
      ${country} ülkesinde ${sector} sektöründeki başlıca oyuncular kimler?
      Pazar liderleri, yeni girenler ve Türk firmalarının rekabet avantajları neler olabilir?
    `;

    return await this.askAI(prompt);
  }
}