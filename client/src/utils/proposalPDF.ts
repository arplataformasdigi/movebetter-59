import jsPDF from 'jspdf';

export interface ProposalPDFData {
  id: string;
  package_name: string;
  patient_name: string;
  package_price: number;
  transport_cost: number;
  other_costs: number;
  other_costs_note?: string;
  payment_method: string;
  installments: number;
  final_price: number;
  created_date: string;
  expiry_date: string;
}

export function downloadProposalPDF(proposal: ProposalPDFData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('MoveBetter Fisioterapia', 20, 30);
  
  doc.setFontSize(16);
  doc.text('Proposta de Tratamento', 20, 45);
  
  // Linha separadora
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);
  
  // Informações da proposta
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  let yPosition = 70;
  
  // Dados do paciente
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE', 20, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  const patientName = proposal.patient_name || proposal.patientName || 'N/A';
  doc.text(`Paciente: ${patientName}`, 20, yPosition);
  yPosition += 20;
  
  // Dados do pacote
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHES DO PACOTE', 20, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Pacote: ${proposal.package_name || proposal.packageName || 'N/A'}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Valor do Pacote: R$ ${(proposal.package_price || proposal.packagePrice || 0).toFixed(2)}`, 20, yPosition);
  yPosition += 8;
  
  const transportCost = proposal.transport_cost || proposal.transportCost || 0;
  if (transportCost > 0) {
    doc.text(`Custo de Transporte: R$ ${transportCost.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
  }
  
  const otherCosts = proposal.other_costs || proposal.otherCosts || 0;
  if (otherCosts > 0) {
    doc.text(`Outros Custos: R$ ${otherCosts.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    const costsNote = proposal.other_costs_note || proposal.otherCostsNote;
    if (costsNote) {
      doc.text(`Observação: ${costsNote}`, 20, yPosition);
      yPosition += 8;
    }
  }
  
  yPosition += 10;
  
  // Dados de pagamento
  doc.setFont('helvetica', 'bold');
  doc.text('CONDIÇÕES DE PAGAMENTO', 20, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Método de Pagamento: ${proposal.payment_method.toUpperCase()}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Número de Parcelas: ${proposal.installments}x`, 20, yPosition);
  yPosition += 8;
  
  if (proposal.installments > 1) {
    const installmentValue = proposal.final_price / proposal.installments;
    doc.text(`Valor por Parcela: R$ ${installmentValue.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Valor total destacado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 128, 0);
  doc.text(`VALOR TOTAL: R$ ${proposal.final_price.toFixed(2)}`, 20, yPosition);
  
  yPosition += 20;
  
  // Datas
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Data da Proposta: ${formatDateForPDF(proposal.created_date)}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Validade da Proposta: ${formatDateForPDF(proposal.expiry_date)}`, 20, yPosition);
  
  // Footer
  yPosition = 250;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('MoveBetter Fisioterapia - Cuidando da sua saúde e bem-estar', 20, yPosition);
  doc.text('Esta proposta é válida até a data especificada acima.', 20, yPosition + 10);
  
  // Download do PDF
  const fileName = `proposta-${proposal.patient_name.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

function formatDateForPDF(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return dateString;
  }
}