import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, DollarSign, TrendingDown, Clock } from "lucide-react";
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
const custosDistribuicao = [
  {
    name: "Proteínas",
    value: 35,
    color: "hsl(0 84% 60%)",
  },
  {
    name: "Vegetais",
    value: 20,
    color: "hsl(142 76% 36%)",
  },
  {
    name: "Laticínios",
    value: 18,
    color: "hsl(25 95% 53%)",
  },
  {
    name: "Grãos",
    value: 15,
    color: "hsl(210 40% 50%)",
  },
  {
    name: "Outros",
    value: 12,
    color: "hsl(20 14% 60%)",
  },
];

// Variação de preço do tomate nos últimos 6 meses
const variacaoPrecoInsumo = [
  {
    mes: "Mai",
    fornecedorA: 4.5,
    fornecedorB: 4.8,
    fornecedorC: 4.6,
  },
  {
    mes: "Jun",
    fornecedorA: 4.7,
    fornecedorB: 4.9,
    fornecedorC: 4.65,
  },
  {
    mes: "Jul",
    fornecedorA: 4.9,
    fornecedorB: 5.1,
    fornecedorC: 4.85,
  },
  {
    mes: "Ago",
    fornecedorA: 5.2,
    fornecedorB: 5.3,
    fornecedorC: 5.0,
  },
  {
    mes: "Set",
    fornecedorA: 5.4,
    fornecedorB: 5.45,
    fornecedorC: 5.15,
  },
  {
    mes: "Out",
    fornecedorA: 5.18,
    fornecedorB: 5.5,
    fornecedorC: 5.2,
  },
];

// Fluxo de vendas por hora (média)
const fluxoPorHora = [
  {
    hora: "08h",
    vendas: 12,
  },
  {
    hora: "09h",
    vendas: 18,
  },
  {
    hora: "10h",
    vendas: 25,
  },
  {
    hora: "11h",
    vendas: 42,
  },
  {
    hora: "12h",
    vendas: 85,
  },
  {
    hora: "13h",
    vendas: 78,
  },
  {
    hora: "14h",
    vendas: 45,
  },
  {
    hora: "15h",
    vendas: 22,
  },
  {
    hora: "16h",
    vendas: 15,
  },
  {
    hora: "17h",
    vendas: 28,
  },
  {
    hora: "18h",
    vendas: 52,
  },
  {
    hora: "19h",
    vendas: 95,
  },
  {
    hora: "20h",
    vendas: 102,
  },
  {
    hora: "21h",
    vendas: 88,
  },
  {
    hora: "22h",
    vendas: 45,
  },
];

// Vendas por dia da semana
const vendasPorDia = [
  {
    dia: "Seg",
    vendas: 320,
  },
  {
    dia: "Ter",
    vendas: 380,
  },
  {
    dia: "Qua",
    vendas: 420,
  },
  {
    dia: "Qui",
    vendas: 540,
  },
  {
    dia: "Sex",
    vendas: 680,
  },
  {
    dia: "Sáb",
    vendas: 820,
  },
  {
    dia: "Dom",
    vendas: 590,
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Pratos Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pratosMaisVendidos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="nome"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
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
              <CardTitle className="flex items-center gap-2 text-foreground">
                <DollarSign className="h-5 w-5 text-success" />
                Rentabilidade por Prato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rentabilidade} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    dataKey="nome"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar dataKey="valor" fill="hsl(var(--success))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        {/* Análise de Fluxo */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5 text-primary" />
                Fluxo de Vendas por Hora
              </CardTitle>
              <p className="text-sm text-muted-foreground">Picos: 12h-14h e 19h-21h</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={fluxoPorHora}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hora" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vendas"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-success" />
                Vendas por Dia da Semana
              </CardTitle>
              <p className="text-sm text-muted-foreground">Maior movimento: Sexta e Sábado</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="vendas" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
export default Relatorios;
