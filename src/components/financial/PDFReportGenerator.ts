
import jsPDF from 'jspdf';
import { FinancialTransaction } from '@/hooks/useFinancialTransactions';

export interface ReportData {
  transactions: FinancialTransaction[];
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
}

export function generateFinancialPDF(reportData: ReportData) {
  const doc = new jsPDF();
  
  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;
  
  // Título
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório Financeiro', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Período
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const formattedStartDate = new Date(reportData.startDate).toLocaleDateString('pt-BR');
  const formattedEndDate = new Date(reportData.endDate).toLocaleDateString('pt-BR');
  doc.text(`Período: ${formattedStartDate} à ${formattedEndDate}`, 20, yPosition);
  yPosition += 15;
  
  // Resumo Financeiro
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Financeiro', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Receitas
  doc.setTextColor(0, 128, 0); // Verde
  doc.text(`Total de Receitas: R$ ${reportData.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
  yPosition += 8;
  
  // Despesas
  doc.setTextColor(255, 0, 0); // Vermelho
  doc.text(`Total de Despesas: R$ ${reportData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
  yPosition += 8;
  
  // Saldo
  doc.setTextColor(reportData.balance >= 0 ? 0 : 255, reportData.balance >= 0 ? 128 : 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Saldo Final: R$ ${reportData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
  yPosition += 20;
  
  // Reset cor
  doc.setTextColor(0, 0, 0);
  
  // Receitas por Categoria
  if (Object.keys(reportData.incomeByCategory).length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Receitas por Categoria', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    Object.entries(reportData.incomeByCategory).forEach(([category, amount]) => {
      doc.text(`${category}: R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }
  
  // Despesas por Categoria
  if (Object.keys(reportData.expensesByCategory).length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Despesas por Categoria', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    Object.entries(reportData.expensesByCategory).forEach(([category, amount]) => {
      doc.text(`${category}: R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 15;
  }
  
  // Transações (últimas 10)
  if (reportData.transactions.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Últimas Transações', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Cabeçalho da tabela
    doc.text('Data', 20, yPosition);
    doc.text('Descrição', 50, yPosition);
    doc.text('Categoria', 120, yPosition);
    doc.text('Valor', 160, yPosition);
    yPosition += 8;
    
    // Linha separadora
    doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
    
    // Últimas 10 transações
    const recentTransactions = reportData.transactions.slice(0, 10);
    
    recentTransactions.forEach((transaction) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const date = new Date(transaction.transaction_date).toLocaleDateString('pt-BR');
      const description = transaction.description.substring(0, 25) + (transaction.description.length > 25 ? '...' : '');
      const category = transaction.financial_categories?.name || 'Sem categoria';
      const amount = `R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      
      // Cor baseada no tipo
      doc.setTextColor(transaction.type === 'income' ? 0 : 255, transaction.type === 'income' ? 128 : 0, 0);
      
      doc.text(date, 20, yPosition);
      doc.text(description, 50, yPosition);
      doc.text(category, 120, yPosition);
      doc.text(amount, 160, yPosition);
      yPosition += 8;
    });
  }
  
  // Reset cor
  doc.setTextColor(0, 0, 0);
  
  // Rodapé
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Download do arquivo
  const fileName = `relatorio-financeiro-${formattedStartDate.replace(/\//g, '-')}-${formattedEndDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
