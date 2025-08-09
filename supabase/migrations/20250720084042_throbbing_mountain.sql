/*
  # TradeScout Müşteri Tablosu

  1. Yeni Tablolar
    - `customers`
      - `id` (uuid, primary key)
      - `country` (text, müşteri ülkesi)
      - `company_name` (text, firma adı)
      - `website` (text, web sitesi - opsiyonel)
      - `sector` (text, sektör)
      - `interest_status` (text, ilgi durumu: 'yes' veya 'no')
      - `priority` (text, öncelik: 'high', 'medium', 'low')
      - `action_note` (text, aksiyon notu)
      - `follow_up_status` (text, takip durumu)
      - `created_at` (timestamptz, oluşturulma tarihi)
      - `updated_at` (timestamptz, güncellenme tarihi)

  2. Güvenlik
    - RLS (Row Level Security) etkinleştirildi
    - Herkese okuma/yazma izni (demo amaçlı)
    - Production'da kullanıcı bazlı güvenlik eklenebilir

  3. İndeksler
    - Ülke ve sektör bazlı hızlı arama için indeksler
    - Tarih bazlı sıralama için indeks
*/

-- Customers tablosunu oluştur
CREATE TABLE IF NOT EXISTS customers (
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

-- RLS (Row Level Security) etkinleştir
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Demo amaçlı herkese erişim izni ver
-- Production'da bu politikalar kullanıcı bazlı olmalı
CREATE POLICY "Enable read access for all users" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON customers
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON customers
  FOR DELETE USING (true);

-- Performans için indeksler
CREATE INDEX IF NOT EXISTS idx_customers_country ON customers(country);
CREATE INDEX IF NOT EXISTS idx_customers_sector ON customers(sector);
CREATE INDEX IF NOT EXISTS idx_customers_priority ON customers(priority);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_company_name ON customers(company_name);

-- Updated_at otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();