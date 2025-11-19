import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Insumos from "./pages/Insumos";
import Fornecedores from "./pages/Fornecedores";
import FichasTecnicas from "./pages/FichasTecnicas";
import EngenhariaCardapio from "./pages/EngenhariaCardapio";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PrecosIngredientes from "./pages/PrecosIngredientes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/precos-ingredientes" element={<PrecosIngredientes />} />
          <Route path="/fichas-tecnicas" element={<FichasTecnicas />} />
          <Route path="/engenharia-cardapio" element={<EngenhariaCardapio />} />
          <Route path="/relatorios" element={<Relatorios />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
