import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, TrendingDown, Clock } from "lucide-react";
import { PriceTrendsChart } from "@/components/Dashboard/PriceTrends";
import { TrafficFlowHeatmap } from "@/components/Dashboard/TrafficFlowHeatmap";
const pratosMaisVendidos = [
  {
    nome: "Massa ao Molho",
    vendas: 145,
  },
  {
    nome: "Risoto de Funghi",
    vendas: 98,
  },
  {
    nome: "Filé à Parmegiana",
    vendas: 87,
  },
  {
    nome: "Salada Caesar",
    vendas: 76,
  },
  {
    nome: "Pizza Margherita",
    vendas: 132,
  },
];
const rentabilidade = [
  {
    nome: "Salada Caesar",
    valor: 61.6,
  },
  {
    nome: "Filé à Parmegiana",
    valor: 60.9,
  },
  {
    nome: "Risoto de Funghi",
    valor: 58.0,
  },
  {
    nome: "Massa ao Molho",
    valor: 56.0,
  },
  {
    nome: "Pizza Margherita",
    valor: 54.2,
  },
];

const Relatorios = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada do seu negócio</p>
        </div>
        {/* Análise de Variação de Preço de Fornecedores */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Variação de Preço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%">
              <PriceTrendsChart />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
export default Relatorios;
