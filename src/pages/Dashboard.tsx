import { MainLayout } from "@/components/Layout/MainLayout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Package, AlertTriangle, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useFetchPontoDeEquilibrio } from "@/hooks/api/useFetchPontoDeEquilibrio";
import { useFetchAlertaPereciveis } from "@/hooks/api/useFetchAlertaPereciveis";
import { TrafficFlowHeatmap } from "@/components/Dashboard/TrafficFlowHeatmap";

const salesData = [
  { name: "Seg", vendas: 4500 },
  { name: "Ter", vendas: 5200 },
  { name: "Qua", vendas: 4800 },
  { name: "Qui", vendas: 6100 },
  { name: "Sex", vendas: 7300 },
  { name: "Sáb", vendas: 8900 },
  { name: "Dom", vendas: 7600 },
];

const costData = [
  { name: "Jan", custo: 15000, receita: 35000 },
  { name: "Fev", custo: 16500, receita: 38000 },
  { name: "Mar", custo: 14800, receita: 36500 },
  { name: "Abr", custo: 17200, receita: 41000 },
];

const Dashboard = () => {
  const { pontoDeEquilibrio } = useFetchPontoDeEquilibrio(new Date().toISOString().split("T")[0], 2000);
  const { alertaPereciveis } = useFetchAlertaPereciveis(48);
  const { quantity, unit, ingredient } = alertaPereciveis[0];
  const pontoEquilibrio = pontoDeEquilibrio?.breakeven || 1;
  const faturamentoAtual = pontoDeEquilibrio?.revenue || 0;
  const percentualAtingido = (faturamentoAtual / pontoEquilibrio) * 100;
  const faltam = pontoEquilibrio - faturamentoAtual;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>

        {/* Alertas de Perecíveis */}
        <div className="space-y-3">
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">Atenção: Produtos Expirando</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              <strong className="text-foreground">
                {quantity}
                {unit} de {ingredient}
              </strong>{" "}
              expiram em <strong className="text-foreground">48 horas</strong>. Considere criar uma promoção
              "Prato do Dia" para evitar desperdício.
            </AlertDescription>
          </Alert>

          <Alert className="border-primary/50 bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Ponto de Equilíbrio Diário</AlertTitle>
            <AlertDescription>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Meta:{" "}
                    <strong className="text-foreground">
                      R$ {pontoDeEquilibrio?.revenue?.toLocaleString("pt-BR")}
                    </strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Atual:{" "}
                    <strong className="text-foreground">
                      R$ {pontoDeEquilibrio?.breakeven?.toLocaleString("pt-BR")}
                    </strong>
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={percentualAtingido >= 100 ? "default" : "secondary"} className="mb-1">
                    {percentualAtingido.toFixed(1)}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {faltam > 0 ? `Faltam R$ ${faltam.toLocaleString("pt-BR")}` : "Meta atingida!"}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Fluxo de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%">
              <TrafficFlowHeatmap />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
