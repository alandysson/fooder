import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    nome: "Estrelas",
    cor: "hsl(var(--success))",
    icon: Target,
    decisao: "Destacar no cardápio, manter qualidade",
    badge: "success",
  },
  2: {
    nome: "Cavalos de Batalha",
    cor: "hsl(var(--primary))",
    icon: TrendingUp,
    decisao: "Aumentar preço ou reduzir custo",
    badge: "default",
  },
  3: {
    nome: "Enigmas",
    cor: "hsl(25 95% 65%)",
    icon: AlertCircle,
    decisao: "Melhorar divulgação e posicionamento",
    badge: "secondary",
  },
  4: {
    nome: "Abacaxis",
    cor: "hsl(var(--destructive))",
    icon: Trash2,
    decisao: "Considerar remoção do cardápio",
    badge: "destructive",
  },
};

// Calcular médias para linhas de referência
const mediaPopularidade = matrizPratos.reduce((acc, p) => acc + p.popularidade, 0) / matrizPratos.length;
const mediaRentabilidade = matrizPratos.reduce((acc, p) => acc + p.rentabilidade, 0) / matrizPratos.length;

const EngenhariaCardapio = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Engenharia de Cardápio</h1>
          <p className="text-muted-foreground">Matriz de Popularidade vs. Rentabilidade</p>
        </div>

        {/* Legenda das Categorias */}
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(categorias).map(([key, cat]) => {
            const Icon = cat.icon;
            return (
              <Card key={key} className="shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg p-2 mt-1" style={{ backgroundColor: `${cat.cor}15` }}>
                      <Icon className="h-5 w-5" style={{ color: cat.cor }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{cat.nome}</h3>
                      <p className="text-xs text-muted-foreground">{cat.decisao}</p>
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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="popularidade"
                  name="Popularidade"
                  stroke="hsl(var(--muted-foreground))"
                  label={{
                    value: "Popularidade (vendas)",
                    position: "bottom",
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="rentabilidade"
                  name="Rentabilidade"
                  stroke="hsl(var(--muted-foreground))"
                  label={{
                    value: "Rentabilidade (%)",
                    angle: -90,
                    position: "left",
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-foreground mb-2">{data.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            Vendas: <span className="font-medium text-foreground">{data.popularidade}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Margem: <span className="font-medium text-foreground">{data.rentabilidade}%</span>
                          </p>
                          <Badge
                            variant={categorias[data.categoria as keyof typeof categorias].badge as any}
                            className="mt-2"
                          >
                            {categorias[data.categoria as keyof typeof categorias].nome}
                          </Badge>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Linhas de referência (média) */}
                <ReferenceLine
                  x={mediaPopularidade}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <ReferenceLine
                  y={mediaRentabilidade}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />

                <Scatter name="Pratos" data={matrizPratos}>
                  {matrizPratos.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={categorias[entry.categoria as keyof typeof categorias].cor}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabela de Pratos por Categoria */}
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(categorias).map(([key, cat]) => {
            const Icon = cat.icon;
            const pratos = matrizPratos.filter((p) => p.categoria === Number(key));

            return (
              <Card key={key} className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" style={{ color: cat.cor }} />
                    <span className="text-foreground">{cat.nome}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{cat.decisao}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pratos.map((prato, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium text-foreground">{prato.nome}</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">{prato.popularidade} vendas</span>
                          <span className="text-muted-foreground">{prato.rentabilidade}%</span>
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
