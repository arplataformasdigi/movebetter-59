const API_BASE_URL = '/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf?: string;
}

// Authentication API
export const authAPI = {
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async patientLogin(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};

// Generic API utility
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Patients API
export const patientsAPI = {
  async getAll() {
    return apiRequest('/patients');
  },

  async create(patient: any) {
    return apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  },

  async update(id: string, patient: any) {
    return apiRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  },

  async delete(id: string) {
    return apiRequest(`/patients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Appointments API
export const appointmentsAPI = {
  async getAll() {
    return apiRequest('/appointments');
  },

  async create(appointment: any) {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },

  async update(id: string, appointment: any) {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  },

  async delete(id: string) {
    return apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Treatment Plans API
export const treatmentPlansAPI = {
  async getAll() {
    return apiRequest('/treatment-plans');
  },

  async create(plan: any) {
    return apiRequest('/treatment-plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  async update(id: string, plan: any) {
    return apiRequest(`/treatment-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  },

  async delete(id: string) {
    return apiRequest(`/treatment-plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Financial Transactions API
export const financialAPI = {
  async getTransactions() {
    return apiRequest('/financial-transactions');
  },

  async createTransaction(transaction: any) {
    return apiRequest('/financial-transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  async updateTransaction(id: string, transaction: any) {
    return apiRequest(`/financial-transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  },

  async deleteTransaction(id: string) {
    return apiRequest(`/financial-transactions/${id}`, {
      method: 'DELETE',
    });
  },
};