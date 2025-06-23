
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { PatientLayout } from "./components/layout/PatientLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { PatientAuthProvider } from "./contexts/PatientAuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PatientProtectedRoute } from "./components/auth/PatientProtectedRoute";
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
import PatientAuth from "./pages/PatientAuth";

const queryClient = new QueryClient();

const App = () => {
  console.log('🚀 APP COMPONENT INITIALIZED');
  console.log('🔧 Query client created');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PatientAuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rota de autenticação para administradores */}
                <Route path="/auth" element={<Auth />} />
                
                {/* Rota de autenticação para pacientes */}
                <Route path="/paciente-login" element={<PatientAuth />} />
                
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

                {/* Rotas protegidas para pacientes */}
                <Route path="/paciente" element={
                  <PatientProtectedRoute>
                    <PatientLayout><PatientDashboard /></PatientLayout>
                  </PatientProtectedRoute>
                } />

                <Route path="/paciente/trilhas" element={
                  <PatientProtectedRoute>
                    <PatientLayout><PatientPlans /></PatientLayout>
                  </PatientProtectedRoute>
                } />

                <Route path="/paciente/agenda" element={
                  <PatientProtectedRoute>
                    <PatientLayout><PatientAppointments /></PatientLayout>
                  </PatientProtectedRoute>
                } />

                <Route path="/paciente/evolucao" element={
                  <PatientProtectedRoute>
                    <PatientLayout><PatientMedicalRecords /></PatientLayout>
                  </PatientProtectedRoute>
                } />

                <Route path="/paciente/dados-pessoais" element={
                  <PatientProtectedRoute>
                    <PatientLayout><PersonalData /></PatientLayout>
                  </PatientProtectedRoute>
                } />

                {/* Página 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PatientAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

console.log('✅ App component definition completed');

export default App;
