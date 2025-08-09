# TradeScout - Müşteri Araştırma Platformu

Modern, responsive ve çok dilli müşteri yönetim sistemi.

## 🚀 Özellikler

### 📊 Analitik ve Raporlama
- Dashboard ile detaylı istatistikler
- Grafik ve chart'larla görsel analiz
- Ülke, sektör ve öncelik dağılımları
- Aylık trend analizi

### 🔍 Gelişmiş Arama ve Filtreleme
- Çoklu filtre kombinasyonu
- Tarih aralığı filtreleme
- Gerçek zamanlı arama
- Filtre temizleme

### 📝 Müşteri Yönetimi
- CRUD işlemleri (Create, Read, Update, Delete)
- Müşteri detay sayfası
- Form validasyonu
- Toplu işlemler

### 🌍 Çoklu Dil Desteği
- Türkçe, İngilizce, Arapça
- RTL (Right-to-Left) desteği
- Dil tercihi kaydetme

### 🤖 AI Destekli Analiz
- ChatGPT-4 ile akıllı firma analizi
- Ülke ve sektör trend analizi
- Risk değerlendirmesi ve öneriler
- Hızlı soru-cevap sistemi
- Otomatik skor hesaplama

## 🛠️ Teknoloji Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Veritabanı**: Supabase (PostgreSQL)
- **Grafik**: Recharts
- **AI**: OpenAI GPT-4 API
- **Routing**: React Router
- **State Management**: React Context + Hooks
- **Icons**: Lucide React

## 📦 Kurulum

### 1. Proje Kurulumu
```bash
npm install
```

### 2. Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. SQL Editor'da migration dosyasını çalıştırın:
   ```sql
   -- supabase/migrations/create_customers_table.sql dosyasındaki kodu çalıştırın
   ```

### 3. Environment Variables

`.env` dosyası oluşturun:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Uygulamayı Başlatın
```bash
npm run dev
```

## 📊 Veritabanı Şeması

### Customers Tablosu
```sql
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  company_name text NOT NULL,
  website text,
  sector text NOT NULL,
  interest_status text NOT NULL CHECK (interest_status IN ('yes', 'no')),
  priority text NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  action_note text NOT NULL,
  follow_up_status text NOT NULL CHECK (follow_up_status IN ('first-follow', 'second-follow', 'none')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔧 API Servisleri

### CustomerService
- `getAllCustomers()` - Tüm müşterileri getir
- `addCustomer(formData)` - Yeni müşteri ekle
- `updateCustomer(id, formData)` - Müşteri güncelle
- `deleteCustomer(id)` - Müşteri sil
- `getCustomerById(id)` - ID ile müşteri getir
- `searchCustomers(filters)` - Filtrelenmiş arama
- `testConnection()` - Veritabanı bağlantı testi

## 🎨 Tasarım Sistemi

### Renkler
- Primary: `#059669` (Emerald 600)
- Secondary: `#0ea5e9` (Sky 500)
- Success: `#10b981` (Emerald 500)
- Warning: `#f59e0b` (Amber 500)
- Error: `#ef4444` (Red 500)

### Typography
- Font Family: Inter
- Heading: 600-700 weight
- Body: 400-500 weight
- Small: 300-400 weight

### Spacing
- 8px grid system
- Consistent padding/margin values

## 📱 Responsive Design

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Güvenlik

- Row Level Security (RLS) etkin
- Input validation
- XSS koruması
- CSRF koruması

## 🚀 Deployment

### Vercel/Netlify
```bash
npm run build
```

### Environment Variables (Production)
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## 📈 Performans

- Lazy loading
- Code splitting
- Image optimization
- Database indexing
- Caching strategies

## 🧪 Testing

```bash
npm run test
```

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Commit yapın
4. Push edin
5. Pull Request açın

## 📞 Destek

Herhangi bir sorun için issue açabilirsiniz.