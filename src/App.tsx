
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { PatientLayout } from "./components/layout/PatientLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import NotFound from "./pages/NotFound";
import Plans from "./pages/Plans";
import CreatePlan from "./pages/CreatePlan";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Calendar from "./pages/Calendar";
import Ranking from "./pages/Ranking";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientPlans from "./pages/patient/PatientPlans";
import PatientMedicalRecords from "./pages/patient/PatientMedicalRecords";
import AccountAccess from "./pages/AccountAccess";
import PersonalData from "./pages/PersonalData";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota de autenticação */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Rotas para administradores, gestores e profissionais */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/pacientes" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><Patients /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/planos" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><Plans /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/planos/criar" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><CreatePlan /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/exercicios" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><ExerciseLibrary /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/calendario" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><Calendar /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/ranking" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><Ranking /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/usuarios" element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <AppLayout><Users /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Novas rotas de perfil */}
            <Route path="/dados-pessoais" element={
              <ProtectedRoute>
                <AppLayout><PersonalData /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/acesso" element={
              <ProtectedRoute>
                <AppLayout><AccountAccess /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/assinatura" element={
              <ProtectedRoute allowedRoles={["admin", "manager", "professional"]}>
                <AppLayout><Subscription /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Rotas para pacientes */}
            <Route path="/paciente" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientDashboard /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/agenda" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientAppointments /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/planos" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientPlans /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/prontuario" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientMedicalRecords /></PatientLayout>
              </ProtectedRoute>
            } />

            {/* Rotas de perfil para pacientes */}
            <Route path="/paciente/dados-pessoais" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PersonalData /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/acesso" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><AccountAccess /></PatientLayout>
              </ProtectedRoute>
            } />

            {/* Redirecionar para a página inicial */}
            <Route path="/" element={<Navigate to="/auth" />} />

            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
