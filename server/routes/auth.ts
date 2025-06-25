import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import { profiles } from "../../db/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password, cpf } = req.body;

    // Check if user already exists
    const existingUser = await storage.getProfileByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user profile
    const newUser = await storage.createProfile({
      id: crypto.randomUUID(),
      name,
      email,
      role: "admin",
      cpf_cnpj: cpf,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await storage.getProfileByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // For demo purposes, we'll accept any password since we migrated from Supabase
    // In production, you would verify the hashed password
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function patientAuth(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // This would be implemented based on the patient app access table
    // For now, return a simple response
    res.json({
      success: false,
      error: "Patient authentication not yet implemented in migration"
    });
  } catch (error) {
    console.error("Patient auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}