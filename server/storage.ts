import { db } from "../db";
import { profiles, patients, appointments, treatmentPlans, financialTransactions, type Profile, type Patient, type Appointment, type TreatmentPlan, type FinancialTransaction } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export class DatabaseService {
  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(profile: typeof profiles.$inferInsert): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, updates: Partial<typeof profiles.$inferInsert>): Promise<Profile> {
    const result = await db.update(profiles).set(updates).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.created_at));
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const result = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
    return result[0];
  }

  async createPatient(patient: typeof patients.$inferInsert): Promise<Patient> {
    const result = await db.insert(patients).values(patient).returning();
    return result[0];
  }

  async updatePatient(id: string, updates: Partial<typeof patients.$inferInsert>): Promise<Patient> {
    const result = await db.update(patients).set(updates).where(eq(patients.id, id)).returning();
    return result[0];
  }

  async deletePatient(id: string): Promise<void> {
    await db.delete(patients).where(eq(patients.id, id));
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.appointment_date));
  }

  async createAppointment(appointment: typeof appointments.$inferInsert): Promise<Appointment> {
    const result = await db.insert(appointments).values(appointment).returning();
    return result[0];
  }

  async updateAppointment(id: string, updates: Partial<typeof appointments.$inferInsert>): Promise<Appointment> {
    const result = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return result[0];
  }

  async deleteAppointment(id: string): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  // Treatment plan methods
  async getTreatmentPlans(): Promise<TreatmentPlan[]> {
    return await db.select().from(treatmentPlans).orderBy(desc(treatmentPlans.created_at));
  }

  async createTreatmentPlan(plan: typeof treatmentPlans.$inferInsert): Promise<TreatmentPlan> {
    const result = await db.insert(treatmentPlans).values(plan).returning();
    return result[0];
  }

  async updateTreatmentPlan(id: string, updates: Partial<typeof treatmentPlans.$inferInsert>): Promise<TreatmentPlan> {
    const result = await db.update(treatmentPlans).set(updates).where(eq(treatmentPlans.id, id)).returning();
    return result[0];
  }

  async deleteTreatmentPlan(id: string): Promise<void> {
    await db.delete(treatmentPlans).where(eq(treatmentPlans.id, id));
  }

  // Financial transaction methods
  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return await db.select().from(financialTransactions).orderBy(desc(financialTransactions.transaction_date));
  }

  async createFinancialTransaction(transaction: typeof financialTransactions.$inferInsert): Promise<FinancialTransaction> {
    const result = await db.insert(financialTransactions).values(transaction).returning();
    return result[0];
  }

  async updateFinancialTransaction(id: string, updates: Partial<typeof financialTransactions.$inferInsert>): Promise<FinancialTransaction> {
    const result = await db.update(financialTransactions).set(updates).where(eq(financialTransactions.id, id)).returning();
    return result[0];
  }

  async deleteFinancialTransaction(id: string): Promise<void> {
    await db.delete(financialTransactions).where(eq(financialTransactions.id, id));
  }
}

export const storage = new DatabaseService();
