import { pgTable, text, serial, integer, boolean, timestamp, uuid, decimal, date, time, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'patient']);
export const patientStatusEnum = pgEnum('patient_status', ['active', 'inactive', 'completed']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['scheduled', 'completed', 'cancelled', 'no_show']);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'overdue', 'cancelled']);

// Tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: userRoleEnum("role").notNull().default('admin'),
  phone: text("phone"),
  crefito: text("crefito"),
  cpf_cnpj: text("cpf_cnpj"),
  cep: text("cep"),
  street: text("street"),
  number: text("number"),
  neighborhood: text("neighborhood"),
  city: text("city"),
  state: text("state"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => profiles.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  birth_date: date("birth_date"),
  cpf: text("cpf"),
  address: text("address"),
  emergency_contact: text("emergency_contact"),
  emergency_phone: text("emergency_phone"),
  medical_history: text("medical_history"),
  status: patientStatusEnum("status").default('active'),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  sessions_included: integer("sessions_included").default(0),
  validity_days: integer("validity_days").default(30),
  services: text("services").array().default([]),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id").references(() => patients.id),
  session_type: text("session_type").notNull(),
  appointment_date: date("appointment_date").notNull(),
  appointment_time: time("appointment_time").notNull(),
  duration_minutes: integer("duration_minutes").default(60),
  status: appointmentStatusEnum("status").default('scheduled'),
  notes: text("notes"),
  observations: text("observations"),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  duration_minutes: integer("duration_minutes"),
  difficulty_level: integer("difficulty_level"),
  category: text("category"),
  video_url: text("video_url"),
  image_url: text("image_url"),
  equipment_needed: text("equipment_needed").array(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const treatmentPlans = pgTable("treatment_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id").references(() => patients.id),
  name: text("name").notNull(),
  description: text("description"),
  start_date: date("start_date").defaultNow(),
  end_date: date("end_date"),
  is_active: boolean("is_active").default(true),
  progress_percentage: integer("progress_percentage").default(0),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const planExercises = pgTable("plan_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  treatment_plan_id: uuid("treatment_plan_id").references(() => treatmentPlans.id),
  exercise_id: uuid("exercise_id").references(() => exercises.id),
  day_number: integer("day_number").notNull(),
  sets: integer("sets").default(1),
  repetitions: integer("repetitions"),
  duration_minutes: integer("duration_minutes"),
  is_completed: boolean("is_completed").default(false),
  completed_at: timestamp("completed_at"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});

export const financialCategories = pgTable("financial_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: transactionTypeEnum("type").notNull(),
  color: text("color").default('#3B82F6'),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const financialTransactions = pgTable("financial_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  category_id: uuid("category_id").references(() => financialCategories.id),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  payment_status: paymentStatusEnum("payment_status").default('pending'),
  transaction_date: date("transaction_date").defaultNow(),
  due_date: date("due_date"),
  payment_date: date("payment_date"),
  notes: text("notes"),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id").references(() => patients.id),
  appointment_id: uuid("appointment_id").references(() => appointments.id),
  date: date("date").defaultNow(),
  chief_complaint: text("chief_complaint"),
  physical_examination: text("physical_examination"),
  diagnosis: text("diagnosis"),
  treatment_plan: text("treatment_plan"),
  medications: text("medications"),
  recommendations: text("recommendations"),
  next_appointment: date("next_appointment"),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const patientScores = pgTable("patient_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id").references(() => patients.id),
  total_points: integer("total_points").default(0),
  completed_exercises: integer("completed_exercises").default(0),
  streak_days: integer("streak_days").default(0),
  last_activity_date: date("last_activity_date"),
  level_number: integer("level_number").default(1),
  achievements: text("achievements").array().default([]),
  is_tracks_active: boolean("is_tracks_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const patientMedicalRecords = pgTable("patient_medical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id").references(() => patients.id),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  weight: decimal("weight").notNull(),
  height: decimal("height").notNull(),
  birth_date: date("birth_date").notNull(),
  profession: text("profession").notNull(),
  marital_status: text("marital_status").notNull(),
  visit_reason: text("visit_reason").notNull(),
  current_condition: text("current_condition").notNull(),
  medical_history: text("medical_history").notNull(),
  treatment_plan: text("treatment_plan").notNull(),
  evaluation: text("evaluation"),
  status: text("status").default('active'),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const patientEvolutions = pgTable("patient_evolutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id").references(() => patients.id),
  medical_record_id: uuid("medical_record_id").references(() => patientMedicalRecords.id),
  queixas_relatos: text("queixas_relatos").notNull(),
  conduta_atendimento: text("conduta_atendimento").notNull(),
  observacoes: text("observacoes"),
  progress_score: integer("progress_score").notNull(),
  previous_score: integer("previous_score"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const packageProposals = pgTable("package_proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  package_id: uuid("package_id").references(() => packages.id),
  package_name: text("package_name"),
  patient_name: text("patient_name").notNull(),
  package_price: decimal("package_price").notNull(),
  transport_cost: decimal("transport_cost").default('0'),
  other_costs: decimal("other_costs").default('0'),
  other_costs_note: text("other_costs_note"),
  payment_method: text("payment_method").notNull(),
  installments: integer("installments").default(1),
  final_price: decimal("final_price").notNull(),
  created_date: date("created_date").defaultNow(),
  expiry_date: date("expiry_date"),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const creditCardRates = pgTable("credit_card_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  rate: decimal("rate").notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const patientAppAccess = pgTable("patient_app_access", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id").references(() => patients.id),
  user_id: uuid("user_id").references(() => profiles.id),
  email: text("email").unique(),
  password_hash: text("password_hash"),
  is_active: boolean("is_active").default(true),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Schema exports for validation
export const insertProfileSchema = createInsertSchema(profiles);
export const insertPatientSchema = createInsertSchema(patients);
export const insertPackageSchema = createInsertSchema(packages);
export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertExerciseSchema = createInsertSchema(exercises);
export const insertTreatmentPlanSchema = createInsertSchema(treatmentPlans);
export const insertPlanExerciseSchema = createInsertSchema(planExercises);
export const insertFinancialCategorySchema = createInsertSchema(financialCategories);
export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions);
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords);
export const insertPatientScoreSchema = createInsertSchema(patientScores);
export const insertPatientMedicalRecordSchema = createInsertSchema(patientMedicalRecords);
export const insertPatientEvolutionSchema = createInsertSchema(patientEvolutions);
export const insertPackageProposalSchema = createInsertSchema(packageProposals);
export const insertCreditCardRateSchema = createInsertSchema(creditCardRates);
export const insertPatientAppAccessSchema = createInsertSchema(patientAppAccess);

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;
export type TreatmentPlan = typeof treatmentPlans.$inferSelect;
export type InsertTreatmentPlan = typeof treatmentPlans.$inferInsert;
export type PlanExercise = typeof planExercises.$inferSelect;
export type InsertPlanExercise = typeof planExercises.$inferInsert;
export type FinancialCategory = typeof financialCategories.$inferSelect;
export type InsertFinancialCategory = typeof financialCategories.$inferInsert;
export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = typeof financialTransactions.$inferInsert;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = typeof medicalRecords.$inferInsert;
export type PatientScore = typeof patientScores.$inferSelect;
export type InsertPatientScore = typeof patientScores.$inferInsert;
export type PatientMedicalRecord = typeof patientMedicalRecords.$inferSelect;
export type InsertPatientMedicalRecord = typeof patientMedicalRecords.$inferInsert;
export type PatientEvolution = typeof patientEvolutions.$inferSelect;
export type InsertPatientEvolution = typeof patientEvolutions.$inferInsert;
export type PackageProposal = typeof packageProposals.$inferSelect;
export type InsertPackageProposal = typeof packageProposals.$inferInsert;
export type CreditCardRate = typeof creditCardRates.$inferSelect;
export type InsertCreditCardRate = typeof creditCardRates.$inferInsert;
export type PatientAppAccess = typeof patientAppAccess.$inferSelect;
export type InsertPatientAppAccess = typeof patientAppAccess.$inferInsert;