import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer } from '../types/Customer';

export interface InvestorReportData {
  // Firma Bilgileri
  companyName: string;
  country: string;
  website?: string;
  foundingYear?: string;
  employeeCount?: string;
  
  // Sektörel Bilgiler
  sector: string;
  mainProducts?: string;
  productionCapacity?: string;
  certificates?: string;
  technologyLevel?: string;
  
  // İhracat Bilgileri
  exportStatus: 'yes' | 'no';
  exportCountries?: string;
  exportRatio?: string;
  seekingDistributor: 'yes' | 'no';
  
  // İş Birliği
  openToTurkishPartnership: 'yes' | 'no';
  partnershipType?: string;
  existingTurkishPartners?: string;
  responseReceived: 'yes' | 'no';
  
  // Aksiyon Bilgileri
  lastAction: string;
  followUpStatus: string;
  contactEstablished: 'yes' | 'no';
  
  // Meta Bilgiler
  reporterName?: string;
  reportDate: Date;
}

export class ReportBotService {
  // Müşteri verisinden rapor verisi oluştur
  static generateReportData(customer: Customer, additionalData?: Partial<InvestorReportData>): InvestorReportData {
    return {
      // Mevcut müşteri verisinden
      companyName: customer.companyName,
      country: customer.country,
      website: customer.website,
      sector: customer.sector,
      lastAction: customer.actionNote,
      followUpStatus: this.getFollowUpText(customer.followUpStatus),
      contactEstablished: 'yes', // Varsayılan
      exportStatus: customer.interestStatus, // İlgi durumu = ihracat durumu
      openToTurkishPartnership: customer.interestStatus,
      responseReceived: customer.followUpStatus !== 'none' ? 'yes' : 'no',
      seekingDistributor: customer.priority === 'high' ? 'yes' : 'no',
      reportDate: new Date(),
      
      // Ek veriler (form genişletildiğinde)
      ...additionalData
    };
  }

  // PDF raporu oluştur
  static async generateInvestorReport(reportData: InvestorReportData): Promise<void> {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    this.addHeader(doc, yPos);
    yPos += 30;

    // 1. Firma Bilgileri
    yPos = this.addSection(doc, '1. 🏢 Firma Bilgileri', [
      ['Firma Adı', reportData.companyName],
      ['Ülke', reportData.country],
      ['Web Sitesi', reportData.website || 'Belirtilmemiş'],
      ['Kuruluş Yılı', reportData.foundingYear || 'Belirtilmemiş'],
      ['Çalışan Sayısı', reportData.employeeCount || 'Belirtilmemiş']
    ], yPos);

    // 2. Sektörel Bilgiler
    yPos = this.addSection(doc, '2. 🏭 Sektörel ve Üretim Detayları', [
      ['Sektör', reportData.sector],
      ['Ana Ürünler', reportData.mainProducts || 'Belirtilmemiş'],
      ['Üretim Kapasitesi', reportData.productionCapacity || 'Belirtilmemiş'],
      ['Sertifikalar', reportData.certificates || 'Belirtilmemiş'],
      ['Teknoloji Düzeyi', reportData.technologyLevel || 'Belirtilmemiş']
    ], yPos);

    // 3. İhracat Bilgileri
    yPos = this.addSection(doc, '3. 🌐 İhracat ve Pazar Bilgisi', [
      ['İhracat Durumu', reportData.exportStatus === 'yes' ? 'Evet' : 'Hayır'],
      ['İhraç Edilen Ülkeler', reportData.exportCountries || 'Belirtilmemiş'],
      ['İhracat Oranı', reportData.exportRatio || 'Belirtilmemiş'],
      ['Distribütör Arayışı', reportData.seekingDistributor === 'yes' ? 'Evet' : 'Hayır']
    ], yPos);

    // 4. İş Birliği
    yPos = this.addSection(doc, '4. 🤝 İş Birliği ve İlgi Durumu', [
      ['Türk firmalarla çalışmaya açık mı?', reportData.openToTurkishPartnership === 'yes' ? 'Evet' : 'Hayır'],
      ['Aradığı iş birliği tipi', reportData.partnershipType || 'Belirtilmemiş'],
      ['Mevcut Türk iş ortakları', reportData.existingTurkishPartners || 'Yok'],
      ['Geri dönüş aldı mı?', reportData.responseReceived === 'yes' ? 'Evet' : 'Hayır']
    ], yPos);

    // 5. Aksiyon Notları
    yPos = this.addSection(doc, '5. 📝 Aksiyon Notları', [
      ['İletişim kuruldu mu?', reportData.contactEstablished === 'yes' ? 'Evet' : 'Hayır'],
      ['Son Aksiyon', reportData.lastAction],
      ['Takip Durumu', reportData.followUpStatus]
    ], yPos);

    // 6. AI Özet (Simüle edilmiş)
    yPos = this.addAISummary(doc, reportData, yPos);

    // 7. Ek Bilgiler
    yPos = this.addSection(doc, '7. 🔖 Ek Bilgiler', [
      ['Formu dolduran kişi', reportData.reporterName || 'Sistem Kullanıcısı'],
      ['Rapor Tarihi', reportData.reportDate.toLocaleDateString('tr-TR')]
    ], yPos);

    // Footer
    this.addFooter(doc);

    // PDF'i indir
    const fileName = `Yatirimci_Raporu_${reportData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  // Header ekle
  private static addHeader(doc: jsPDF, yPos: number): void {
    // Logo placeholder
    doc.setFillColor(5, 150, 105);
    doc.rect(20, yPos - 5, 8, 8, 'F');
    
    // Başlık
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('YATIRIMCI RAPORU', 35, yPos);
    
    // Alt başlık
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('TradeScout - Müşteri Araştırma Platformu', 35, yPos + 8);
    
    // Çizgi
    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 15, 190, yPos + 15);
  }

  // Bölüm ekle
  private static addSection(doc: jsPDF, title: string, data: string[][], yPos: number): number {
    // Sayfa kontrolü
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Bölüm başlığı
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPos);
    yPos += 10;

    // Tablo
    autoTable(doc, {
      startY: yPos,
      head: [],
      body: data,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 120 }
      },
      margin: { left: 20, right: 20 }
    });

    return (doc as any).lastAutoTable.finalY + 15;
  }

  // AI Özet ekle
  private static addAISummary(doc: jsPDF, reportData: InvestorReportData, yPos: number): number {
    // Sayfa kontrolü
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    // Başlık
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('6. 📊 Rapor Özeti (AI Analizi)', 20, yPos);
    yPos += 15;

    // AI Özet oluştur
    const summary = this.generateAISummary(reportData);

    // Özet kutusu
    doc.setFillColor(240, 248, 255);
    doc.rect(20, yPos - 5, 170, 30, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(20, yPos - 5, 170, 30);

    // Özet metni
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(summary, 160);
    doc.text(splitText, 25, yPos + 5);

    return yPos + 40;
  }

  // AI Özet oluştur (simüle edilmiş)
  private static generateAISummary(reportData: InvestorReportData): string {
    const companyName = reportData.companyName;
    const country = reportData.country;
    const sector = reportData.sector;
    const exportStatus = reportData.exportStatus === 'yes' ? 'ihracat yapan' : 'yerel pazar odaklı';
    const partnership = reportData.openToTurkishPartnership === 'yes' ? 'Türk firmalarla iş birliğine açık' : 'iş birliği konusunda temkinli';
    const response = reportData.responseReceived === 'yes' ? 'olumlu geri dönüş alınmış' : 'henüz net geri dönüş alınmamış';

    let recommendation = '';
    if (reportData.exportStatus === 'yes' && reportData.openToTurkishPartnership === 'yes' && reportData.responseReceived === 'yes') {
      recommendation = 'Yüksek potansiyelli, öncelikli takip edilmesi önerilen firma.';
    } else if (reportData.exportStatus === 'yes' && reportData.openToTurkishPartnership === 'yes') {
      recommendation = 'Potansiyeli yüksek, detaylı görüşme yapılması önerilen firma.';
    } else if (reportData.openToTurkishPartnership === 'yes') {
      recommendation = 'Orta seviye potansiyel, takip edilebilir.';
    } else {
      recommendation = 'Düşük potansiyel, uzun vadeli takip önerilir.';
    }

    return `${companyName}, ${country} merkezli ${exportStatus} bir ${sector} firmasıdır. ${partnership} ve ${response}. ${recommendation}`;
  }

  // Footer ekle
  private static addFooter(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Alt çizgi
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(20, 280, 190, 280);
      
      // Footer metni
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('TradeScout © 2025 - Gizli ve Özel', 20, 285);
      doc.text(`Sayfa ${i} / ${pageCount}`, 170, 285);
    }
  }

  // Yardımcı fonksiyonlar
  private static getFollowUpText(status: string): string {
    switch (status) {
      case 'first-follow': return '1. Takip';
      case 'second-follow': return '2. Takip';
      case 'none': return 'Takip Yok';
      default: return status;
    }
  }

  // Toplu rapor oluştur
  static async generateBulkReports(customers: Customer[]): Promise<void> {
    for (const customer of customers) {
      const reportData = this.generateReportData(customer);
      await this.generateInvestorReport(reportData);
      
      // Kısa bekleme (tarayıcı donmasını önlemek için)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Özet rapor oluştur (tüm müşteriler)
  static async generateSummaryReport(customers: Customer[]): Promise<void> {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    this.addHeader(doc, yPos);
    yPos += 30;

    // Genel İstatistikler
    const stats = {
      total: customers.length,
      interested: customers.filter(c => c.interestStatus === 'yes').length,
      highPriority: customers.filter(c => c.priority === 'high').length,
      inFollowUp: customers.filter(c => c.followUpStatus !== 'none').length
    };

    yPos = this.addSection(doc, 'Genel İstatistikler', [
      ['Toplam Firma', stats.total.toString()],
      ['İlgili Firmalar', stats.interested.toString()],
      ['Yüksek Öncelik', stats.highPriority.toString()],
      ['Takipte Olanlar', stats.inFollowUp.toString()]
    ], yPos);

    // Ülke Dağılımı
    const countryStats = customers.reduce((acc, customer) => {
      acc[customer.country] = (acc[customer.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countryData = Object.entries(countryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => [country, count.toString()]);

    yPos = this.addSection(doc, 'Ülke Dağılımı (Top 10)', countryData, yPos);

    // Sektör Dağılımı
    const sectorStats = customers.reduce((acc, customer) => {
      acc[customer.sector] = (acc[customer.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sectorData = Object.entries(sectorStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([sector, count]) => [sector, count.toString()]);

    yPos = this.addSection(doc, 'Sektör Dağılımı (Top 10)', sectorData, yPos);

    // Footer
    this.addFooter(doc);

    // PDF'i indir
    doc.save(`TradeScout_Ozet_Raporu_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}