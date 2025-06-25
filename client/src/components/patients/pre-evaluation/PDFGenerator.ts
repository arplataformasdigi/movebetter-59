
import { PreEvaluation } from "@/hooks/usePatientPreEvaluations";

export const generatePreEvaluationPDF = (evaluation: PreEvaluation, patientName: string) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Popup bloqueado. Permita popups para gerar o PDF.');
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pré-avaliação - ${patientName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; }
        .field { margin-bottom: 8px; }
        .field-label { font-weight: bold; display: inline-block; min-width: 150px; }
        .field-value { display: inline-block; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FICHA DE PRÉ-AVALIAÇÃO</h1>
        <h2>FISIOTERAPIA</h2>
      </div>

      <div class="section">
        <div class="section-title">Dados do Paciente</div>
        <div class="field">
          <span class="field-label">Nome:</span>
          <span class="field-value">${patientName}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Informações Gerais</div>
        <div class="field">
          <span class="field-label">Profissão:</span>
          <span class="field-value">${evaluation.profissao}</span>
        </div>
        <div class="field">
          <span class="field-label">Atividade Física:</span>
          <span class="field-value">${evaluation.atividade_fisica}</span>
        </div>
        <div class="field">
          <span class="field-label">Hobby:</span>
          <span class="field-value">${evaluation.hobby}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Queixa e Dor</div>
        <div class="field">
          <span class="field-label">Queixa Principal:</span>
          <span class="field-value">${evaluation.queixa_principal}</span>
        </div>
        <div class="field">
          <span class="field-label">Tempo do Problema:</span>
          <span class="field-value">${evaluation.tempo_problema}</span>
        </div>
        <div class="field">
          <span class="field-label">Descrição da Dor:</span>
          <span class="field-value">${evaluation.descricao_dor}</span>
        </div>
        <div class="field">
          <span class="field-label">Escala da Dor:</span>
          <span class="field-value">${evaluation.escala_dor}</span>
        </div>
      </div>

      <div class="footer">
        <p>Data de Avaliação: ${new Date(evaluation.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};
