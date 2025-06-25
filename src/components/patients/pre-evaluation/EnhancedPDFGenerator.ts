
import { PreEvaluation } from "@/hooks/usePatientPreEvaluations";

export const generateCompletePreEvaluationPDF = (evaluation: PreEvaluation, patientName: string) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Popup bloqueado. Permita popups para gerar o PDF.');
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pré-avaliação Completa - ${patientName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin-bottom: 20px; break-inside: avoid; }
        .section-title { font-weight: bold; font-size: 13px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .field { margin-bottom: 6px; display: flex; }
        .field-label { font-weight: bold; min-width: 140px; flex-shrink: 0; }
        .field-value { flex: 1; }
        .two-columns { display: flex; gap: 20px; }
        .column { flex: 1; }
        @media print {
          body { margin: 10px; }
          .section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FICHA COMPLETA DE PRÉ-AVALIAÇÃO FISIOTERAPÊUTICA</h1>
        <h2>${patientName}</h2>
        <p>Data: ${new Date(evaluation.created_at).toLocaleDateString('pt-BR')}</p>
      </div>

      <div class="section">
        <div class="section-title">DADOS GERAIS</div>
        <div class="two-columns">
          <div class="column">
            <div class="field">
              <span class="field-label">Profissão:</span>
              <span class="field-value">${evaluation.profissao || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Atividade Física:</span>
              <span class="field-value">${evaluation.atividade_fisica || 'Não informado'}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <span class="field-label">Hobby:</span>
              <span class="field-value">${evaluation.hobby || 'Não informado'}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">DOR E SINTOMAS</div>
        <div class="field">
          <span class="field-label">Queixa Principal:</span>
          <span class="field-value">${evaluation.queixa_principal || 'Não informado'}</span>
        </div>
        <div class="two-columns">
          <div class="column">
            <div class="field">
              <span class="field-label">Tempo do Problema:</span>
              <span class="field-value">${evaluation.tempo_problema || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Início do Problema:</span>
              <span class="field-value">${evaluation.inicio_problema || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Tratamento Anterior:</span>
              <span class="field-value">${evaluation.tratamento_anterior || 'Não informado'}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <span class="field-label">Escala da Dor:</span>
              <span class="field-value">${evaluation.escala_dor || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Descrição da Dor:</span>
              <span class="field-value">${evaluation.descricao_dor || 'Não informado'}</span>
            </div>
          </div>
        </div>
        <div class="field">
          <span class="field-label">Irradiação da Dor:</span>
          <span class="field-value">${evaluation.irradiacao_dor || 'Não informado'}</span>
        </div>
        <div class="two-columns">
          <div class="column">
            <div class="field">
              <span class="field-label">O que Piora a Dor:</span>
              <span class="field-value">${evaluation.piora_dor || 'Não informado'}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <span class="field-label">O que Alivia a Dor:</span>
              <span class="field-value">${evaluation.alivio_dor || 'Não informado'}</span>
            </div>
          </div>
        </div>
        <div class="field">
          <span class="field-label">Interferência nas Atividades:</span>
          <span class="field-value">${evaluation.interferencia_dor || 'Não informado'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">SAÚDE E HISTÓRICO MÉDICO</div>
        <div class="field">
          <span class="field-label">Diagnóstico Médico:</span>
          <span class="field-value">${evaluation.diagnostico_medico || 'Não informado'}</span>
        </div>
        <div class="field">
          <span class="field-label">Exames Recentes:</span>
          <span class="field-value">${evaluation.exames_recentes || 'Não informado'}</span>
        </div>
        <div class="field">
          <span class="field-label">Condições de Saúde:</span>
          <span class="field-value">${evaluation.condicoes_saude || 'Não informado'}</span>
        </div>
        <div class="field">
          <span class="field-label">Cirurgias:</span>
          <span class="field-value">${evaluation.cirurgias || 'Não informado'}</span>
        </div>
        <div class="two-columns">
          <div class="column">
            <div class="field">
              <span class="field-label">Medicamentos:</span>
              <span class="field-value">${evaluation.medicamentos || 'Não informado'}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <span class="field-label">Alergias:</span>
              <span class="field-value">${evaluation.alergias || 'Não informado'}</span>
            </div>
          </div>
        </div>
        <div class="field">
          <span class="field-label">Doenças Familiares:</span>
          <span class="field-value">${evaluation.doencas_familiares || 'Não informado'}</span>
        </div>
        <div class="field">
          <span class="field-label">Condições Similares na Família:</span>
          <span class="field-value">${evaluation.condicoes_similares || 'Não informado'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">ESTILO DE VIDA</div>
        <div class="two-columns">
          <div class="column">
            <div class="field">
              <span class="field-label">Alimentação:</span>
              <span class="field-value">${evaluation.alimentacao || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Padrão de Sono:</span>
              <span class="field-value">${evaluation.padrao_sono || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Consumo de Álcool:</span>
              <span class="field-value">${evaluation.alcool || 'Não informado'}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <span class="field-label">Fumante:</span>
              <span class="field-value">${evaluation.fumante || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Ingestão de Água:</span>
              <span class="field-value">${evaluation.ingestao_agua || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Tempo Sentado/Dia:</span>
              <span class="field-value">${evaluation.tempo_sentado || 'Não informado'}</span>
            </div>
          </div>
        </div>
        <div class="two-columns">
          <div class="column">
            <div class="field">
              <span class="field-label">Nível de Estresse:</span>
              <span class="field-value">${evaluation.nivel_estresse || 'Não informado'}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <span class="field-label">Exercícios em Casa:</span>
              <span class="field-value">${evaluation.exercicios_casa || 'Não informado'}</span>
            </div>
          </div>
        </div>
        <div class="field">
          <span class="field-label">Questões Emocionais:</span>
          <span class="field-value">${evaluation.questoes_emocionais || 'Não informado'}</span>
        </div>
        <div class="field">
          <span class="field-label">Impacto na Qualidade de Vida:</span>
          <span class="field-value">${evaluation.impacto_qualidade_vida || 'Não informado'}</span>
        </div>
        <div class="field">
          <span class="field-label">Expectativas do Tratamento:</span>
          <span class="field-value">${evaluation.expectativas_tratamento || 'Não informado'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">FUNCIONALIDADE E LIMITAÇÕES</div>
        <div class="field">
          <span class="field-label">Dificuldades no Dia a Dia:</span>
          <span class="field-value">${evaluation.dificuldade_dia || 'Não informado'}</span>
        </div>
        <div class="two-columns">
          <div class="column">
            <div class="field">
              <span class="field-label">Dispositivo de Auxílio:</span>
              <span class="field-value">${evaluation.dispositivo_auxilio || 'Não informado'}</span>
            </div>
            <div class="field">
              <span class="field-label">Dificuldade de Equilíbrio:</span>
              <span class="field-value">${evaluation.dificuldade_equilibrio || 'Não informado'}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <span class="field-label">Limitação de Movimento:</span>
              <span class="field-value">${evaluation.limitacao_movimento || 'Não informado'}</span>
            </div>
          </div>
        </div>
        <div class="field">
          <span class="field-label">Restrições Especiais:</span>
          <span class="field-value">${evaluation.restricoes || 'Não informado'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">INFORMAÇÕES ADICIONAIS</div>
        <div class="field">
          <span class="field-label">Informações Adicionais:</span>
          <span class="field-value">${evaluation.info_adicional || 'Não informado'}</span>
        </div>
        <div class="field">
          <span class="field-label">Dúvidas sobre Fisioterapia:</span>
          <span class="field-value">${evaluation.duvidas_fisioterapia || 'Não informado'}</span>
        </div>
      </div>

      <div class="footer" style="margin-top: 40px; text-align: center; font-size: 10px; color: #666;">
        <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
        <p>Este documento contém informações confidenciais do paciente</p>
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
