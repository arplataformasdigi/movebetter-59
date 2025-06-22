export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          observations: string | null
          patient_id: string | null
          session_type: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          observations?: string | null
          patient_id?: string | null
          session_type: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          observations?: string | null
          patient_id?: string | null
          session_type?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_card_rates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          rate: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rate: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rate?: number
        }
        Relationships: []
      }
      exercises: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          duration_minutes: number | null
          equipment_needed: string[] | null
          id: string
          image_url: string | null
          instructions: string | null
          is_active: boolean | null
          name: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_active?: boolean | null
          name: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_active?: boolean | null
          name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      financial_categories: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string
          due_date: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          transaction_date: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          appointment_id: string | null
          chief_complaint: string | null
          created_at: string | null
          created_by: string | null
          date: string | null
          diagnosis: string | null
          id: string
          medications: string | null
          next_appointment: string | null
          patient_id: string | null
          physical_examination: string | null
          recommendations: string | null
          treatment_plan: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          diagnosis?: string | null
          id?: string
          medications?: string | null
          next_appointment?: string | null
          patient_id?: string | null
          physical_examination?: string | null
          recommendations?: string | null
          treatment_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          diagnosis?: string | null
          id?: string
          medications?: string | null
          next_appointment?: string | null
          patient_id?: string | null
          physical_examination?: string | null
          recommendations?: string | null
          treatment_plan?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      package_proposals: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_date: string | null
          expiry_date: string | null
          final_price: number
          id: string
          installments: number | null
          other_costs: number | null
          other_costs_note: string | null
          package_id: string | null
          package_name: string | null
          package_price: number
          patient_name: string
          payment_method: string
          transport_cost: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          created_date?: string | null
          expiry_date?: string | null
          final_price: number
          id?: string
          installments?: number | null
          other_costs?: number | null
          other_costs_note?: string | null
          package_id?: string | null
          package_name?: string | null
          package_price: number
          patient_name: string
          payment_method: string
          transport_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          created_date?: string | null
          expiry_date?: string | null
          final_price?: number
          id?: string
          installments?: number | null
          other_costs?: number | null
          other_costs_note?: string | null
          package_id?: string | null
          package_name?: string | null
          package_price?: number
          patient_name?: string
          payment_method?: string
          transport_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_proposals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_proposals_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          services: string[] | null
          sessions_included: number | null
          updated_at: string | null
          validity_days: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          services?: string[] | null
          sessions_included?: number | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          services?: string[] | null
          sessions_included?: number | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Relationships: []
      }
      patient_evolutions: {
        Row: {
          conduta_atendimento: string
          created_at: string | null
          id: string
          is_active: boolean | null
          medical_record_id: string
          observacoes: string | null
          patient_id: string
          previous_score: number | null
          progress_score: number
          queixas_relatos: string
          updated_at: string | null
        }
        Insert: {
          conduta_atendimento: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          medical_record_id: string
          observacoes?: string | null
          patient_id: string
          previous_score?: number | null
          progress_score: number
          queixas_relatos: string
          updated_at?: string | null
        }
        Update: {
          conduta_atendimento?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          medical_record_id?: string
          observacoes?: string | null
          patient_id?: string
          previous_score?: number | null
          progress_score?: number
          queixas_relatos?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_evolutions_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "patient_medical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_evolutions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_medical_records: {
        Row: {
          age: number
          birth_date: string
          created_at: string | null
          current_condition: string
          evaluation: string | null
          gender: string
          height: number
          id: string
          is_active: boolean | null
          marital_status: string
          medical_history: string
          patient_id: string
          profession: string
          treatment_plan: string
          updated_at: string | null
          visit_reason: string
          weight: number
        }
        Insert: {
          age: number
          birth_date: string
          created_at?: string | null
          current_condition: string
          evaluation?: string | null
          gender: string
          height: number
          id?: string
          is_active?: boolean | null
          marital_status: string
          medical_history: string
          patient_id: string
          profession: string
          treatment_plan: string
          updated_at?: string | null
          visit_reason: string
          weight: number
        }
        Update: {
          age?: number
          birth_date?: string
          created_at?: string | null
          current_condition?: string
          evaluation?: string | null
          gender?: string
          height?: number
          id?: string
          is_active?: boolean | null
          marital_status?: string
          medical_history?: string
          patient_id?: string
          profession?: string
          treatment_plan?: string
          updated_at?: string | null
          visit_reason?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_packages: {
        Row: {
          assigned_date: string | null
          created_at: string | null
          expiry_date: string | null
          final_price: number | null
          id: string
          package_id: string | null
          patient_id: string | null
          sessions_used: number | null
          status: string | null
        }
        Insert: {
          assigned_date?: string | null
          created_at?: string | null
          expiry_date?: string | null
          final_price?: number | null
          id?: string
          package_id?: string | null
          patient_id?: string | null
          sessions_used?: number | null
          status?: string | null
        }
        Update: {
          assigned_date?: string | null
          created_at?: string | null
          expiry_date?: string | null
          final_price?: number | null
          id?: string
          package_id?: string | null
          patient_id?: string | null
          sessions_used?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_packages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_pre_evaluations: {
        Row: {
          alcool: string
          alergias: string | null
          alimentacao: string
          alivio_dor: string
          atividade_fisica: string
          cirurgias: string
          condicoes_saude: string
          condicoes_similares: string
          created_at: string | null
          descricao_dor: string
          diagnostico_medico: string
          dificuldade_dia: string
          dificuldade_equilibrio: string
          dispositivo_auxilio: string
          doencas_familiares: string
          duvidas_fisioterapia: string | null
          escala_dor: string
          exames_recentes: string
          exercicios_casa: string
          expectativas_tratamento: string | null
          fumante: string
          hobby: string
          id: string
          impacto_qualidade_vida: string | null
          info_adicional: string | null
          ingestao_agua: string
          inicio_problema: string
          interferencia_dor: string
          irradiacao_dor: string
          limitacao_movimento: string
          medicamentos: string | null
          nivel_estresse: string | null
          padrao_sono: string
          patient_id: string
          piora_dor: string
          profissao: string
          queixa_principal: string
          questoes_emocionais: string | null
          restricoes: string | null
          tempo_problema: string
          tempo_sentado: string
          tratamento_anterior: string
          updated_at: string | null
        }
        Insert: {
          alcool: string
          alergias?: string | null
          alimentacao: string
          alivio_dor: string
          atividade_fisica: string
          cirurgias: string
          condicoes_saude: string
          condicoes_similares: string
          created_at?: string | null
          descricao_dor: string
          diagnostico_medico: string
          dificuldade_dia: string
          dificuldade_equilibrio: string
          dispositivo_auxilio: string
          doencas_familiares: string
          duvidas_fisioterapia?: string | null
          escala_dor: string
          exames_recentes: string
          exercicios_casa: string
          expectativas_tratamento?: string | null
          fumante: string
          hobby: string
          id?: string
          impacto_qualidade_vida?: string | null
          info_adicional?: string | null
          ingestao_agua: string
          inicio_problema: string
          interferencia_dor: string
          irradiacao_dor: string
          limitacao_movimento: string
          medicamentos?: string | null
          nivel_estresse?: string | null
          padrao_sono: string
          patient_id: string
          piora_dor: string
          profissao: string
          queixa_principal: string
          questoes_emocionais?: string | null
          restricoes?: string | null
          tempo_problema: string
          tempo_sentado: string
          tratamento_anterior: string
          updated_at?: string | null
        }
        Update: {
          alcool?: string
          alergias?: string | null
          alimentacao?: string
          alivio_dor?: string
          atividade_fisica?: string
          cirurgias?: string
          condicoes_saude?: string
          condicoes_similares?: string
          created_at?: string | null
          descricao_dor?: string
          diagnostico_medico?: string
          dificuldade_dia?: string
          dificuldade_equilibrio?: string
          dispositivo_auxilio?: string
          doencas_familiares?: string
          duvidas_fisioterapia?: string | null
          escala_dor?: string
          exames_recentes?: string
          exercicios_casa?: string
          expectativas_tratamento?: string | null
          fumante?: string
          hobby?: string
          id?: string
          impacto_qualidade_vida?: string | null
          info_adicional?: string | null
          ingestao_agua?: string
          inicio_problema?: string
          interferencia_dor?: string
          irradiacao_dor?: string
          limitacao_movimento?: string
          medicamentos?: string | null
          nivel_estresse?: string | null
          padrao_sono?: string
          patient_id?: string
          piora_dor?: string
          profissao?: string
          queixa_principal?: string
          questoes_emocionais?: string | null
          restricoes?: string | null
          tempo_problema?: string
          tempo_sentado?: string
          tratamento_anterior?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_pre_evaluations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_scores: {
        Row: {
          achievements: string[] | null
          completed_exercises: number | null
          created_at: string | null
          id: string
          is_tracks_active: boolean | null
          last_activity_date: string | null
          level_number: number | null
          patient_id: string | null
          streak_days: number | null
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          completed_exercises?: number | null
          created_at?: string | null
          id?: string
          is_tracks_active?: boolean | null
          last_activity_date?: string | null
          level_number?: number | null
          patient_id?: string | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          completed_exercises?: number | null
          created_at?: string | null
          id?: string
          is_tracks_active?: boolean | null
          last_activity_date?: string | null
          level_number?: number | null
          patient_id?: string | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_scores_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          medical_history: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["patient_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          medical_history?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          medical_history?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_exercises: {
        Row: {
          completed_at: string | null
          created_at: string | null
          day_number: number
          duration_minutes: number | null
          exercise_id: string | null
          id: string
          is_completed: boolean | null
          notes: string | null
          repetitions: number | null
          sets: number | null
          treatment_plan_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          day_number: number
          duration_minutes?: number | null
          exercise_id?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          repetitions?: number | null
          sets?: number | null
          treatment_plan_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          day_number?: number
          duration_minutes?: number | null
          exercise_id?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          repetitions?: number | null
          sets?: number | null
          treatment_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_exercises_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cpf_cnpj: string | null
          created_at: string | null
          crefito: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          cpf_cnpj?: string | null
          created_at?: string | null
          crefito?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          cpf_cnpj?: string | null
          created_at?: string | null
          crefito?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      treatment_plans: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          patient_id: string | null
          progress_percentage: number | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          patient_id?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          patient_id?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_status: "scheduled" | "completed" | "cancelled" | "no_show"
      patient_status: "active" | "inactive" | "completed"
      payment_status: "pending" | "paid" | "overdue" | "cancelled"
      transaction_type: "income" | "expense"
      user_role: "admin" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["scheduled", "completed", "cancelled", "no_show"],
      patient_status: ["active", "inactive", "completed"],
      payment_status: ["pending", "paid", "overdue", "cancelled"],
      transaction_type: ["income", "expense"],
      user_role: ["admin", "patient"],
    },
  },
} as const
