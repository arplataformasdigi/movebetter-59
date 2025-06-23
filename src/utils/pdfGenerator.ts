
import { PreEvaluation } from '@/hooks/usePatientPreEvaluations';

export const generatePreEvaluationPDF = (
  preEvaluation: PreEvaluation,
  patientName: string
) => {
  // Create a new window for the PDF
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
        .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; }
        @media print {
          body { margin: 0; }
          .header { page-break-after: avoid; }
        }
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
        <div class="section-title">Informações Pessoais e Profissionais</div>
        <div class="field">
          <span class="field-label">Profissão:</span>
          <span class="field-value">${preEvaluation.profissao}</span>
        </div>
        <div class="field">
          <span class="field-label">Atividade Física:</span>
          <span class="field-value">${preEvaluation.atividade_fisica}</span>
        </div>
        <div class="field">
          <span class="field-label">Hobby:</span>
          <span class="field-value">${preEvaluation.hobby}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Queixa Principal e Histórico</div>
        <div class="field">
          <span class="field-label">Queixa Principal:</span>
          <span class="field-value">${preEvaluation.queixa_principal}</span>
        </div>
        <div class="field">
          <span class="field-label">Tempo do Problema:</span>
          <span class="field-value">${preEvaluation.tempo_problema}</span>
        </div>
        <div class="field">
          <span class="field-label">Início do Problema:</span>
          <span class="field-value">${preEvaluation.inicio_problema}</span>
        </div>
        <div class="field">
          <span class="field-label">Tratamento Anterior:</span>
          <span class="field-value">${preEvaluation.tratamento_anterior}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Caracterização da Dor</div>
        <div class="field">
          <span class="field-label">Descrição da Dor:</span>
          <span class="field-value">${preEvaluation.descricao_dor}</span>
        </div>
        <div class="field">
          <span class="field-label">Escala da Dor:</span>
          <span class="field-value">${preEvaluation.escala_dor}</span>
        </div>
        <div class="field">
          <span class="field-label">Irradiação da Dor:</span>
          <span class="field-value">${preEvaluation.irradiacao_dor}</span>
        </div>
        <div class="field">
          <span class="field-label">O que Piora a Dor:</span>
          <span class="field-value">${preEvaluation.piora_dor}</span>
        </div>
        <div class="field">
          <span class="field-label">O que Alivia a Dor:</span>
          <span class="field-value">${preEvaluation.alivio_dor}</span>
        </div>
        <div class="field">
          <span class="field-label">Interferência da Dor:</span>
          <span class="field-value">${preEvaluation.interferencia_dor}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Histórico Médico</div>
        <div class="field">
          <span class="field-label">Diagnóstico Médico:</span>
          <span class="field-value">${preEvaluation.diagnostico_medico}</span>
        </div>
        <div class="field">
          <span class="field-label">Exames Recentes:</span>
          <span class="field-value">${preEvaluation.exames_recentes}</span>
        </div>
        <div class="field">
          <span class="field-label">Condições de Saúde:</span>
          <span class="field-value">${preEvaluation.condicoes_saude}</span>
        </div>
        <div class="field">
          <span class="field-label">Cirurgias:</span>
          <span class="field-value">${preEvaluation.cirurgias}</span>
        </div>
        ${preEvaluation.medicamentos ? `
        <div class="field">
          <span class="field-label">Medicamentos:</span>
          <span class="field-value">${preEvaluation.medicamentos}</span>
        </div>
        ` : ''}
        ${preEvaluation.alergias ? `
        <div class="field">
          <span class="field-label">Alergias:</span>
          <span class="field-value">${preEvaluation.alergias}</span>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">Histórico Familiar e Pessoal</div>
        <div class="field">
          <span class="field-label">Doenças Familiares:</span>
          <span class="field-value">${preEvaluation.doencas_familiares}</span>
        </div>
        <div class="field">
          <span class="field-label">Condições Similares:</span>
          <span class="field-value">${preEvaluation.condicoes_similares}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Hábitos de Vida</div>
        <div class="field">
          <span class="field-label">Alimentação:</span>
          <span class="field-value">${preEvaluation.alimentacao}</span>
        </div>
        <div class="field">
          <span class="field-label">Padrão de Sono:</span>
          <span class="field-value">${preEvaluation.padrao_sono}</span>
        </div>
        <div class="field">
          <span class="field-label">Álcool:</span>
          <span class="field-value">${preEvaluation.alcool}</span>
        </div>
        <div class="field">
          <span class="field-label">Fumante:</span>
          <span class="field-value">${preEvaluation.fumante}</span>
        </div>
        <div class="field">
          <span class="field-label">Ingestão de Água:</span>
          <span class="field-value">${preEvaluation.ingestao_agua}</span>
        </div>
        <div class="field">
          <span class="field-label">Tempo Sentado:</span>
          <span class="field-value">${preEvaluation.tempo_sentado}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Aspectos Funcionais</div>
        <div class="field">
          <span class="field-label">Exercícios em Casa:</span>
          <span class="field-value">${preEvaluation.exercicios_casa}</span>
        </div>
        <div class="field">
          <span class="field-label">Dificuldade nas Atividades Diárias:</span>
          <span class="field-value">${preEvaluation.dificuldade_dia}</span>
        </div>
        <div class="field">
          <span class="field-label">Dispositivo de Auxílio:</span>
          <span class="field-value">${preEvaluation.dispositivo_auxilio}</span>
        </div>
        <div class="field">
          <span class="field-label">Dificuldade de Equilíbrio:</span>
          <span class="field-value">${preEvaluation.dificuldade_equilibrio}</span>
        </div>
        <div class="field">
          <span class="field-label">Limitação de Movimento:</span>
          <span class="field-value">${preEvaluation.limitacao_movimento}</span>
        </div>
      </div>

      ${preEvaluation.nivel_estresse || preEvaluation.questoes_emocionais || preEvaluation.impacto_qualidade_vida ? `
      <div class="section">
        <div class="section-title">Aspectos Emocionais e Qualidade de Vida</div>
        ${preEvaluation.nivel_estresse ? `
        <div class="field">
          <span class="field-label">Nível de Estresse:</span>
          <span class="field-value">${preEvaluation.nivel_estresse}</span>
        </div>
        ` : ''}
        ${preEvaluation.questoes_emocionais ? `
        <div class="field">
          <span class="field-label">Questões Emocionais:</span>
          <span class="field-value">${preEvaluation.questoes_emocionais}</span>
        </div>
        ` : ''}
        ${preEvaluation.impacto_qualidade_vida ? `
        <div class="field">
          <span class="field-label">Impacto na Qualidade de Vida:</span>
          <span class="field-value">${preEvaluation.impacto_qualidade_vida}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      ${preEvaluation.expectativas_tratamento || preEvaluation.restricoes || preEvaluation.info_adicional || preEvaluation.duvidas_fisioterapia ? `
      <div class="section">
        <div class="section-title">Informações Adicionais</div>
        ${preEvaluation.expectativas_tratamento ? `
        <div class="field">
          <span class="field-label">Expectativas do Tratamento:</span>
          <span class="field-value">${preEvaluation.expectativas_tratamento}</span>
        </div>
        ` : ''}
        ${preEvaluation.restricoes ? `
        <div class="field">
          <span class="field-label">Restrições:</span>
          <span class="field-value">${preEvaluation.restricoes}</span>
        </div>
        ` : ''}
        ${preEvaluation.info_adicional ? `
        <div class="field">
          <span class="field-label">Informações Adicionais:</span>
          <span class="field-value">${preEvaluation.info_adicional}</span>
        </div>
        ` : ''}
        ${preEvaluation.duvidas_fisioterapia ? `
        <div class="field">
          <span class="field-label">Dúvidas sobre Fisioterapia:</span>
          <span class="field-value">${preEvaluation.duvidas_fisioterapia}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <div class="footer">
        <p>Data de Avaliação: ${new Date(preEvaluation.created_at).toLocaleDateString('pt-BR')}</p>
        <p>Este documento foi gerado automaticamente pelo sistema de gerenciamento de pacientes.</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};
