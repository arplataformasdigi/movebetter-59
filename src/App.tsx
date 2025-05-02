
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import NotFound from "./pages/NotFound";
import Plans from "./pages/Plans";
import CreatePlan from "./pages/CreatePlan";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Calendar from "./pages/Calendar";
import Ranking from "./pages/Ranking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/pacientes" element={<AppLayout><Patients /></AppLayout>} />
          <Route path="/planos" element={<AppLayout><Plans /></AppLayout>} />
          <Route path="/planos/criar" element={<AppLayout><CreatePlan /></AppLayout>} />
          <Route path="/exercicios" element={<AppLayout><ExerciseLibrary /></AppLayout>} />
          <Route path="/calendario" element={<AppLayout><Calendar /></AppLayout>} />
          <Route path="/ranking" element={<AppLayout><Ranking /></AppLayout>} />
          <Route path="/mensagens" element={<AppLayout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Mensagens</h1><p className="text-gray-600">Em construção</p></div></div></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
