import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Target, TrendingUp, AlertCircle, Trash2 } from "lucide-react";
import { useFetchMatrizPopularidade } from "@/hooks/api/useFetchMatrizPopularidade";
import { useFetchMatrizPopularidadeCategoria } from "@/hooks/api/useFetchMatrizPopularidadeCategoria";

// Dados da matriz: Popularidade (vendas) vs Rentabilidade (margem %)
const matrizPratos = [
  // CATEGORIA 1: Alta Popularidade, Alta Rentabilidade (ESTRELAS)
  { nome: "Massa ao Molho", popularidade: 145, rentabilidade: 56.0, categoria: 1 },
  { nome: "Pizza Margherita", popularidade: 132, rentabilidade: 54.2, categoria: 1 },

  // CATEGORIA 2: Alta Popularidade, Baixa Rentabilidade (CAVALOS DE BATALHA)
  { nome: "Filé à Parmegiana", popularidade: 87, rentabilidade: 42.5, categoria: 2 },
  { nome: "Salada Caesar", popularidade: 76, rentabilidade: 38.8, categoria: 2 },

  // CATEGORIA 3: Baixa Popularidade, Alta Rentabilidade (ENIGMAS)
  { nome: "Risoto de Funghi", popularidade: 45, rentabilidade: 58.0, categoria: 3 },
  { nome: "Carpaccio Premium", popularidade: 32, rentabilidade: 62.3, categoria: 3 },

  // CATEGORIA 4: Baixa Popularidade, Baixa Rentabilidade (ABACAXIS)
  { nome: "Sopa de Legumes", popularidade: 15, rentabilidade: 28.5, categoria: 4 },
  { nome: "Wrap Vegetariano", popularidade: 22, rentabilidade: 35.2, categoria: 4 },
];

const categorias = {
  1: {
    cor: "hsl(var(--success))",
    icon: Target,
  },
  2: {
    cor: "hsl(var(--primary))",
    icon: TrendingUp,
  },
  3: {
    cor: "hsl(25 95% 65%)",
    icon: AlertCircle,
  },
  4: {
    cor: "hsl(var(--destructive))",
    icon: Trash2,
  },
};

// Calcular médias para linhas de referência

const EngenhariaCardapio = () => {
  const { matrizPopularidade } = useFetchMatrizPopularidade(
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0]
  );
  const { matrizPopularidadeCategoria } = useFetchMatrizPopularidadeCategoria(
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0]
  );
  const arrayDeCategorias = Object.values(matrizPopularidadeCategoria?.categories || []);

  const scatterData = matrizPopularidade.items?.map((item) => ({
    name: item.name,
    qty: item.qty,
    profit: item.profit_per_dish,
    revenue: item.revenue,
    category: item.category,
  }));

  const getCategoryColor = (category: number) => {
    const colors = {
      1: "#22c55e", // Popular + Rentável (verde)
      2: "#f59e0b", // Popular mas não rentável (laranja)
      3: "#3b82f6", // Não popular mas rentável (azul)
      4: "#ef4444", // Nem popular nem rentável (vermelho)
    };
    return colors[category] || "#94a3b8";
  };
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Engenharia de Cardápio</h1>
          <p className="text-muted-foreground">Matriz de Popularidade vs. Rentabilidade</p>
        </div>

        {/* Legenda das Categorias */}
        <div className="grid gap-4 md:grid-cols-4">
          {arrayDeCategorias.map((categoria: any, index) => {
            const Icon = categorias[index + 1]?.icon;
            return (
              <Card key={index} className="shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="rounded-lg p-2 mt-1"
                      style={{ backgroundColor: `${categorias[index + 1]?.cor}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: categorias[index + 1]?.cor }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{categoria.name}</h3>
                      <p className="text-xs text-muted-foreground">{categoria.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Matriz 2x2 */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Matriz de Decisão</CardTitle>
            <p className="text-sm text-muted-foreground">
              Eixo X: Popularidade (vendas) | Eixo Y: Rentabilidade (margem %)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="qty"
                  name="Quantidade Vendida"
                  label={{ value: "Quantidade Vendida", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="profit"
                  name="Lucro por Prato"
                  label={{ value: "Lucro por Prato (R$)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        >
                          <p>
                            <strong>{data.name}</strong>
                          </p>
                          <p>Quantidade: {data.qty}</p>
                          <p>Lucro/Prato: R$ {data.profit.toFixed(2)}</p>
                          <p>Receita Total: R$ {data.revenue.toFixed(2)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Linhas de referência (média) */}
                <ReferenceLine
                  x={matrizPopularidade.thresholds?.popularity_qty}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <ReferenceLine
                  y={matrizPopularidade.thresholds?.profitability_per_dish}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <Scatter name="Pratos" data={scatterData} fill="#8884d8">
                  {scatterData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabela de Pratos por Categoria */}
        <div className="grid gap-6 md:grid-cols-2">
          {arrayDeCategorias.map((categoria: any, index) => {
            const Icon = categorias[index + 1]?.icon;

            return (
              <Card key={index} className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" style={{ color: categorias[index + 1]?.cor }} />
                    <span className="text-foreground">{categoria.name}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{categoria.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoria.items?.map((prato, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium text-foreground">{prato.name}</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">{prato.qty} vendas</span>
                          <span className="text-muted-foreground">{prato.profit_per_dish}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default EngenhariaCardapio;
