import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer } from '../types/Customer';

export class ExportService {
  // Excel/CSV Export
  static exportToExcel(customers: Customer[], filename: string = 'customers'): void {
    const data = customers.map(customer => ({
      'Ülke': customer.country,
      'Firma Adı': customer.companyName,
      'Web Sitesi': customer.website || '',
      'Sektör': customer.sector,
      'İlgi Durumu': customer.interestStatus === 'yes' ? 'Evet' : 'Hayır',
      'Öncelik': customer.priority === 'high' ? 'Yüksek' : 
                customer.priority === 'medium' ? 'Orta' : 'Düşük',
      'Aksiyon Notu': customer.actionNote,
      'Takip Durumu': customer.followUpStatus === 'first-follow' ? '1. Takip' :
                     customer.followUpStatus === 'second-follow' ? '2. Takip' : 'Yok',
      'Kayıt Tarihi': new Date(customer.createdAt).toLocaleDateString('tr-TR')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Müşteriler');
    
    // Column widths
    const colWidths = [
      { wch: 15 }, // Ülke
      { wch: 25 }, // Firma Adı
      { wch: 30 }, // Web Sitesi
      { wch: 15 }, // Sektör
      { wch: 12 }, // İlgi Durumu
      { wch: 10 }, // Öncelik
      { wch: 40 }, // Aksiyon Notu
      { wch: 12 }, // Takip Durumu
      { wch: 12 }  // Kayıt Tarihi
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  static exportToCSV(customers: Customer[], filename: string = 'customers'): void {
    const data = customers.map(customer => ({
      'Ülke': customer.country,
      'Firma Adı': customer.companyName,
      'Web Sitesi': customer.website || '',
      'Sektör': customer.sector,
      'İlgi Durumu': customer.interestStatus === 'yes' ? 'Evet' : 'Hayır',
      'Öncelik': customer.priority === 'high' ? 'Yüksek' : 
                customer.priority === 'medium' ? 'Orta' : 'Düşük',
      'Aksiyon Notu': customer.actionNote,
      'Takip Durumu': customer.followUpStatus === 'first-follow' ? '1. Takip' :
                     customer.followUpStatus === 'second-follow' ? '2. Takip' : 'Yok',
      'Kayıt Tarihi': new Date(customer.createdAt).toLocaleDateString('tr-TR')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // PDF Export
  static exportToPDF(customers: Customer[], filename: string = 'customers'): void {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('TradeScout - Müşteri Listesi', 14, 15);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 25);
    
    // Table data
    const tableData = customers.map(customer => [
      customer.country,
      customer.companyName,
      customer.sector,
      customer.interestStatus === 'yes' ? 'Evet' : 'Hayır',
      customer.priority === 'high' ? 'Yüksek' : 
      customer.priority === 'medium' ? 'Orta' : 'Düşük',
      customer.followUpStatus === 'first-follow' ? '1. Takip' :
      customer.followUpStatus === 'second-follow' ? '2. Takip' : 'Yok',
      new Date(customer.createdAt).toLocaleDateString('tr-TR')
    ]);

    autoTable(doc, {
      head: [['Ülke', 'Firma Adı', 'Sektör', 'İlgi', 'Öncelik', 'Takip', 'Tarih']],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [5, 150, 105], // Emerald color
        textColor: 255
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Ülke
        1: { cellWidth: 40 }, // Firma Adı
        2: { cellWidth: 25 }, // Sektör
        3: { cellWidth: 15 }, // İlgi
        4: { cellWidth: 20 }, // Öncelik
        5: { cellWidth: 20 }, // Takip
        6: { cellWidth: 25 }  // Tarih
      }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Sayfa ${i} / ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Backup Export (JSON)
  static exportBackup(customers: Customer[]): void {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      customers: customers
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { 
      type: 'application/json' 
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tradescout_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // Statistics Export
  static exportStatistics(customers: Customer[]): void {
    const stats = {
      totalCustomers: customers.length,
      interestedCustomers: customers.filter(c => c.interestStatus === 'yes').length,
      highPriorityCustomers: customers.filter(c => c.priority === 'high').length,
      inFollowUpCustomers: customers.filter(c => c.followUpStatus !== 'none').length,
      countryDistribution: this.getCountryDistribution(customers),
      sectorDistribution: this.getSectorDistribution(customers),
      priorityDistribution: this.getPriorityDistribution(customers),
      generatedAt: new Date().toISOString()
    };

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('TradeScout - İstatistik Raporu', 14, 15);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 25);
    
    // Statistics
    let yPos = 40;
    doc.setFontSize(12);
    doc.text('Genel İstatistikler:', 14, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Toplam Müşteri: ${stats.totalCustomers}`, 20, yPos);
    yPos += 7;
    doc.text(`İlgili Müşteri: ${stats.interestedCustomers}`, 20, yPos);
    yPos += 7;
    doc.text(`Yüksek Öncelik: ${stats.highPriorityCustomers}`, 20, yPos);
    yPos += 7;
    doc.text(`Takipte: ${stats.inFollowUpCustomers}`, 20, yPos);

    doc.save(`tradescout_istatistikler_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private static getCountryDistribution(customers: Customer[]) {
    const distribution: Record<string, number> = {};
    customers.forEach(customer => {
      distribution[customer.country] = (distribution[customer.country] || 0) + 1;
    });
    return distribution;
  }

  private static getSectorDistribution(customers: Customer[]) {
    const distribution: Record<string, number> = {};
    customers.forEach(customer => {
      distribution[customer.sector] = (distribution[customer.sector] || 0) + 1;
    });
    return distribution;
  }

  private static getPriorityDistribution(customers: Customer[]) {
    const distribution: Record<string, number> = {};
    customers.forEach(customer => {
      distribution[customer.priority] = (distribution[customer.priority] || 0) + 1;
    });
    return distribution;
  }
}