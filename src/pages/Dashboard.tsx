import { MainLayout } from "@/components/Layout/MainLayout";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Package, AlertTriangle, AlertCircle, Clock } from "lucide-react";
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
  // Ponto de equilíbrio
  const pontoEquilibrio = 2000;
  const faturamentoAtual = 1650;
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
              <strong className="text-foreground">3kg de salmão</strong> expiram em{" "}
              <strong className="text-foreground">48 horas</strong>. Previsão de uso: apenas 1kg. Considere
              criar uma promoção "Prato do Dia" para evitar desperdício.
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
                    <strong className="text-foreground">R$ {pontoEquilibrio.toLocaleString("pt-BR")}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Atual:{" "}
                    <strong className="text-foreground">R$ {faturamentoAtual.toLocaleString("pt-BR")}</strong>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Faturamento Mensal"
            value="R$ 127.450"
            icon={DollarSign}
            trend={{ value: "12.5%", isPositive: true }}
            variant="success"
          />
          <StatsCard
            title="Margem de Lucro"
            value="58.3%"
            icon={TrendingUp}
            trend={{ value: "3.2%", isPositive: true }}
            variant="success"
          />
          <StatsCard title="Itens em Estoque" value="248" icon={Package} variant="default" />
          <StatsCard title="Produtos Vencendo" value="12" icon={AlertTriangle} variant="warning" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Vendas da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Custos vs Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line type="monotone" dataKey="receita" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line type="monotone" dataKey="custo" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
