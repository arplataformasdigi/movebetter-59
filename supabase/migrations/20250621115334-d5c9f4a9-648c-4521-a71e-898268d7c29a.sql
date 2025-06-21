
-- Criar tabela para prontuários médicos
CREATE TABLE IF NOT EXISTS patient_medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    weight NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    birth_date DATE NOT NULL,
    profession TEXT NOT NULL,
    marital_status TEXT NOT NULL,
    visit_reason TEXT NOT NULL,
    current_condition TEXT NOT NULL,
    medical_history TEXT NOT NULL,
    treatment_plan TEXT NOT NULL,
    evaluation TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para evoluções do paciente
CREATE TABLE IF NOT EXISTS patient_evolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medical_record_id UUID NOT NULL REFERENCES patient_medical_records(id) ON DELETE CASCADE,
    queixas_relatos TEXT NOT NULL,
    conduta_atendimento TEXT NOT NULL,
    observacoes TEXT,
    progress_score INTEGER NOT NULL CHECK (progress_score >= 0 AND progress_score <= 10),
    previous_score INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para pré-avaliações
CREATE TABLE IF NOT EXISTS patient_pre_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    -- Informações pessoais
    profissao TEXT NOT NULL,
    atividade_fisica TEXT NOT NULL,
    hobby TEXT NOT NULL,
    -- Queixa Principal
    queixa_principal TEXT NOT NULL,
    tempo_problema TEXT NOT NULL,
    inicio_problema TEXT NOT NULL,
    tratamento_anterior TEXT NOT NULL,
    -- Caracterização da Dor
    descricao_dor TEXT NOT NULL,
    escala_dor TEXT NOT NULL,
    irradiacao_dor TEXT NOT NULL,
    piora_dor TEXT NOT NULL,
    alivio_dor TEXT NOT NULL,
    interferencia_dor TEXT NOT NULL,
    -- Histórico Médico
    diagnostico_medico TEXT NOT NULL,
    exames_recentes TEXT NOT NULL,
    condicoes_saude TEXT NOT NULL,
    cirurgias TEXT NOT NULL,
    medicamentos TEXT,
    alergias TEXT,
    -- Histórico Familiar
    doencas_familiares TEXT NOT NULL,
    condicoes_similares TEXT NOT NULL,
    -- Hábitos e Estilo de Vida
    alimentacao TEXT NOT NULL,
    padrao_sono TEXT NOT NULL,
    alcool TEXT NOT NULL,
    fumante TEXT NOT NULL,
    ingestao_agua TEXT NOT NULL,
    tempo_sentado TEXT NOT NULL,
    -- Aspectos Psicossociais
    nivel_estresse TEXT,
    questoes_emocionais TEXT,
    impacto_qualidade_vida TEXT,
    -- Objetivos e Expectativas
    expectativas_tratamento TEXT,
    exercicios_casa TEXT NOT NULL,
    restricoes TEXT,
    -- Avaliação Funcional
    dificuldade_dia TEXT NOT NULL,
    dispositivo_auxilio TEXT NOT NULL,
    dificuldade_equilibrio TEXT NOT NULL,
    limitacao_movimento TEXT NOT NULL,
    -- Informações Adicionais
    info_adicional TEXT,
    duvidas_fisioterapia TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE patient_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_evolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_pre_evaluations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para patient_medical_records
CREATE POLICY "Users can view all medical records" ON patient_medical_records FOR SELECT USING (true);
CREATE POLICY "Users can create medical records" ON patient_medical_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update medical records" ON patient_medical_records FOR UPDATE USING (true);
CREATE POLICY "Users can delete medical records" ON patient_medical_records FOR DELETE USING (true);

-- Políticas RLS para patient_evolutions
CREATE POLICY "Users can view all evolutions" ON patient_evolutions FOR SELECT USING (true);
CREATE POLICY "Users can create evolutions" ON patient_evolutions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update evolutions" ON patient_evolutions FOR UPDATE USING (true);
CREATE POLICY "Users can delete evolutions" ON patient_evolutions FOR DELETE USING (true);

-- Políticas RLS para patient_pre_evaluations
CREATE POLICY "Users can view all pre evaluations" ON patient_pre_evaluations FOR SELECT USING (true);
CREATE POLICY "Users can create pre evaluations" ON patient_pre_evaluations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update pre evaluations" ON patient_pre_evaluations FOR UPDATE USING (true);
CREATE POLICY "Users can delete pre evaluations" ON patient_pre_evaluations FOR DELETE USING (true);

-- Criar triggers para updated_at
CREATE TRIGGER update_patient_medical_records_updated_at
    BEFORE UPDATE ON patient_medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_patient_evolutions_updated_at
    BEFORE UPDATE ON patient_evolutions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_patient_pre_evaluations_updated_at
    BEFORE UPDATE ON patient_pre_evaluations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
