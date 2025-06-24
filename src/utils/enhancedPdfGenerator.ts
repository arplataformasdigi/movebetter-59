
import jsPDF from 'jspdf';

interface PreEvaluationData {
  // Dados Gerais
  profissao: string;
  atividade_fisica: string;
  hobby: string;
  
  // Dor e Sintomas
  queixa_principal: string;
  tempo_problema: string;
  inicio_problema: string;
  tratamento_anterior: string;
  descricao_dor: string;
  escala_dor: string;
  irradiacao_dor: string;
  piora_dor: string;
  alivio_dor: string;
  interferencia_dor: string;
  
  // Saúde e Histórico
  diagnostico_medico: string;
  exames_recentes: string;
  condicoes_saude: string;
  cirurgias: string;
  medicamentos: string;
  alergias: string;
  doencas_familiares: string;
  condicoes_similares: string;
  
  // Estilo de Vida
  alimentacao: string;
  padrao_sono: string;
  alcool: string;
  fumante: string;
  ingestao_agua: string;
  tempo_sentado: string;
  nivel_estresse: string;
  questoes_emocionais: string;
  impacto_qualidade_vida: string;
  expectativas_tratamento: string;
  
  // Funcionalidade
  exercicios_casa: string;
  restricoes: string;
  dificuldade_dia: string;
  dispositivo_auxilio: string;
  limitacao_movimento: string;
  dificuldade_equilibrio: string;
  
  // Informações Adicionais
  info_adicional: string;
  duvidas_fisioterapia: string;
}

interface PatientData {
  name: string;
  birth_date?: string;
  profession?: string;
  gender?: string;
  marital_status?: string;
}

export function generateEnhancedPreEvaluationPDF(
  preEvaluation: PreEvaluationData,
  patient: PatientData
): void {
  console.log('📄 Generating enhanced pre-evaluation PDF...');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 30;

  // Função para adicionar texto com quebra de linha
  const addText = (text: string, x: number, y: number, maxWidth: number = pageWidth - 2 * margin) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  // Função para adicionar seção
  const addSection = (title: string, content: string, label?: string) => {
    // Verificar se precisa de nova página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    // Título da seção
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    yPosition = addText(title, margin, yPosition);
    yPosition += 3;

    // Conteúdo
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    if (label) {
      yPosition = addText(`${label}: ${content || 'Não informado'}`, margin + 5, yPosition);
    } else {
      yPosition = addText(content || 'Não informado', margin + 5, yPosition);
    }
    
    yPosition += 5;
    return yPosition;
  };

  // Cabeçalho
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('FICHA DE PRÉ-AVALIAÇÃO FISIOTERAPÊUTICA', pageWidth / 2, 20, { align: 'center' });

  // Dados do Paciente
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addText('DADOS DO PACIENTE', margin, yPosition);
  yPosition += 3;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  yPosition = addText(`Nome: ${patient.name}`, margin + 5, yPosition);
  
  if (patient.birth_date) {
    const birthDate = new Date(patient.birth_date).toLocaleDateString('pt-BR');
    yPosition = addText(`Data de Nascimento: ${birthDate}`, margin + 5, yPosition);
  }
  
  yPosition += 10;

  // SEÇÃO 1: DADOS GERAIS
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addText('1. DADOS GERAIS', margin, yPosition);
  yPosition += 5;

  yPosition = addSection('Profissão', preEvaluation.profissao);
  yPosition = addSection('Atividade Física', preEvaluation.atividade_fisica);
  yPosition = addSection('Hobby/Lazer', preEvaluation.hobby);

  // SEÇÃO 2: DOR E SINTOMAS
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addText('2. DOR E SINTOMAS', margin, yPosition);
  yPosition += 5;

  yPosition = addSection('Queixa Principal', preEvaluation.queixa_principal);
  yPosition = addSection('Tempo do Problema', preEvaluation.tempo_problema);
  yPosition = addSection('Início do Problema', preEvaluation.inicio_problema);
  yPosition = addSection('Tratamento Anterior', preEvaluation.tratamento_anterior);
  yPosition = addSection('Descrição da Dor', preEvaluation.descricao_dor);
  yPosition = addSection('Escala de Dor (0-10)', preEvaluation.escala_dor);
  yPosition = addSection('Irradiação da Dor', preEvaluation.irradiacao_dor);
  yPosition = addSection('Fatores de Piora', preEvaluation.piora_dor);
  yPosition = addSection('Fatores de Alívio', preEvaluation.alivio_dor);
  yPosition = addSection('Interferência da Dor', preEvaluation.interferencia_dor);

  // SEÇÃO 3: SAÚDE E HISTÓRICO
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addText('3. SAÚDE E HISTÓRICO MÉDICO', margin, yPosition);
  yPosition += 5;

  yPosition = addSection('Diagnóstico Médico', preEvaluation.diagnostico_medico);
  yPosition = addSection('Exames Recentes', preEvaluation.exames_recentes);
  yPosition = addSection('Condições de Saúde', preEvaluation.condicoes_saude);
  yPosition = addSection('Cirurgias', preEvaluation.cirurgias);
  yPosition = addSection('Medicamentos', preEvaluation.medicamentos);
  yPosition = addSection('Alergias', preEvaluation.alergias);
  yPosition = addSection('Doenças Familiares', preEvaluation.doencas_familiares);
  yPosition = addSection('Condições Similares na Família', preEvaluation.condicoes_similares);

  // SEÇÃO 4: ESTILO DE VIDA
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addText('4. ESTILO DE VIDA', margin, yPosition);
  yPosition += 5;

  yPosition = addSection('Alimentação', preEvaluation.alimentacao);
  yPosition = addSection('Padrão de Sono', preEvaluation.padrao_sono);
  yPosition = addSection('Consumo de Álcool', preEvaluation.alcool);
  yPosition = addSection('Fumante', preEvaluation.fumante);
  yPosition = addSection('Ingestão de Água', preEvaluation.ingestao_agua);
  yPosition = addSection('Tempo Sentado', preEvaluation.tempo_sentado);
  yPosition = addSection('Nível de Estresse', preEvaluation.nivel_estresse);
  yPosition = addSection('Questões Emocionais', preEvaluation.questoes_emocionais);
  yPosition = addSection('Impacto na Qualidade de Vida', preEvaluation.impacto_qualidade_vida);
  yPosition = addSection('Expectativas do Tratamento', preEvaluation.expectativas_tratamento);

  // SEÇÃO 5: FUNCIONALIDADE
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addText('5. FUNCIONALIDADE', margin, yPosition);
  yPosition += 5;

  yPosition = addSection('Exercícios em Casa', preEvaluation.exercicios_casa);
  yPosition = addSection('Restrições', preEvaluation.restricoes);
  yPosition = addSection('Dificuldades do Dia a Dia', preEvaluation.dificuldade_dia);
  yPosition = addSection('Dispositivo de Auxílio', preEvaluation.dispositivo_auxilio);
  yPosition = addSection('Limitação de Movimento', preEvaluation.limitacao_movimento);
  yPosition = addSection('Dificuldade de Equilíbrio', preEvaluation.dificuldade_equilibrio);

  // SEÇÃO 6: INFORMAÇÕES ADICIONAIS
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  yPosition = addText('6. INFORMAÇÕES ADICIONAIS', margin, yPosition);
  yPosition += 5;

  yPosition = addSection('Informações Adicionais', preEvaluation.info_adicional);
  yPosition = addSection('Dúvidas sobre Fisioterapia', preEvaluation.duvidas_fisioterapia);

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(
      `Ficha de Pré-avaliação - ${patient.name} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );
  }

  // Salvar o PDF
  const fileName = `pre-avaliacao-${patient.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  console.log('✅ Enhanced PDF generated successfully:', fileName);
}
