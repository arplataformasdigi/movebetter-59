
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
import Trilhas from "./pages/Trilhas";
import CreatePlan from "./pages/CreatePlan";
import Calendar from "./pages/Calendar";
import Ranking from "./pages/Ranking";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientPlans from "./pages/patient/PatientPlans";
import PatientMedicalRecords from "./pages/patient/PatientMedicalRecords";
import PersonalData from "./pages/PersonalData";
import Subscription from "./pages/Subscription";
import AppPage from "./pages/App";
import Packages from "./pages/Packages";
import Financial from "./pages/Financial";

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
            
            {/* Rotas para administradores */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/pacientes" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Patients /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/trilhas" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Trilhas /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/trilhas/criar" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><CreatePlan /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/calendario" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Calendar /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/pacotes" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Packages /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/aplicativo" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><AppPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/financeiro" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Financial /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/ranking" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Ranking /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/dados-pessoais" element={
              <ProtectedRoute>
                <AppLayout><PersonalData /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/assinatura" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout><Subscription /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Rotas para pacientes */}
            <Route path="/paciente" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientDashboard /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/trilhas" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientPlans /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/agenda" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientAppointments /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/evolucao" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PatientMedicalRecords /></PatientLayout>
              </ProtectedRoute>
            } />

            <Route path="/paciente/dados-pessoais" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout><PersonalData /></PatientLayout>
              </ProtectedRoute>
            } />

            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
