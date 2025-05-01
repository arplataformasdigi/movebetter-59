
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import NotFound from "./pages/NotFound";

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
          <Route path="/planos" element={<AppLayout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Página de Planos</h1><p className="text-gray-600">Em construção</p></div></div></AppLayout>} />
          <Route path="/exercicios" element={<AppLayout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Biblioteca de Exercícios</h1><p className="text-gray-600">Em construção</p></div></div></AppLayout>} />
          <Route path="/calendario" element={<AppLayout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Calendário</h1><p className="text-gray-600">Em construção</p></div></div></AppLayout>} />
          <Route path="/mensagens" element={<AppLayout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Mensagens</h1><p className="text-gray-600">Em construção</p></div></div></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
