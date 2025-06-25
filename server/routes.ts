import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerUser, loginUser, patientAuth } from "./routes/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/patient", patientAuth);

  // Patients routes
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patient = await storage.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(500).json({ error: "Failed to create patient" });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.updatePatient(req.params.id, req.body);
      res.json(patient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(500).json({ error: "Failed to update patient" });
    }
  });

  app.delete("/api/patients/:id", async (req, res) => {
    try {
      await storage.deletePatient(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ error: "Failed to delete patient" });
    }
  });

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointment = await storage.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  // Treatment plans routes
  app.get("/api/treatment-plans", async (req, res) => {
    try {
      const plans = await storage.getTreatmentPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching treatment plans:", error);
      res.status(500).json({ error: "Failed to fetch treatment plans" });
    }
  });

  app.post("/api/treatment-plans", async (req, res) => {
    try {
      const plan = await storage.createTreatmentPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      console.error("Error creating treatment plan:", error);
      res.status(500).json({ error: "Failed to create treatment plan" });
    }
  });

  // Financial transactions routes
  app.get("/api/financial-transactions", async (req, res) => {
    try {
      const transactions = await storage.getFinancialTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching financial transactions:", error);
      res.status(500).json({ error: "Failed to fetch financial transactions" });
    }
  });

  app.post("/api/financial-transactions", async (req, res) => {
    try {
      const transaction = await storage.createFinancialTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating financial transaction:", error);
      res.status(500).json({ error: "Failed to create financial transaction" });
    }
  });

  // Rota para buscar CEP via ViaCEP
  app.get("/api/cep/:cep", async (req, res) => {
    try {
      const { cep } = req.params;
      const cleanCep = cep.replace(/\D/g, "");
      
      if (cleanCep.length !== 8) {
        return res.status(400).json({ erro: true, message: "CEP deve ter 8 dígitos" });
      }
      
      console.log('Fetching CEP from ViaCEP:', cleanCep);
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error(`ViaCEP API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('ViaCEP response:', data);
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching CEP:', error);
      res.status(500).json({ 
        erro: true, 
        message: "Erro ao buscar CEP" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
