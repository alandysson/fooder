import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import { useFetchTendenciaPrecos } from "@/hooks/api/useFetchTendenciaPrecos";
import { useFetchInsumos } from "@/hooks/api/useFetchInsumos";

// Cores para diferentes fornecedores
const SUPPLIER_COLORS = [
  "#3b82f6", // Azul
  "#22c55e", // Verde
  "#f59e0b", // Laranja
  "#ef4444", // Vermelho
  "#8b5cf6", // Roxo
  "#ec4899", // Rosa
  "#06b6d4", // Ciano
  "#84cc16", // Lima
];

export function PriceTrendsChart() {
  const [ingredientId, setIngredientId] = useState<number | null>(null);
  const {
    tendenciaPrecos: priceTrends,
    isFetching: loadingPrices,
    error,
  } = useFetchTendenciaPrecos(ingredientId || 0);
  const { insumos: ingredientsResponse, isFetching: loadingIngredients } = useFetchInsumos(1);

  // Processar dados para o gráfico
  const chartData = (() => {
    if (!priceTrends || priceTrends.length === 0) return [];

    // Agrupar preços por fornecedor
    const groupedBySupplier = priceTrends.reduce(
      (acc, price) => {
        const supplierName = price.supplier.name;
        if (!acc[supplierName]) {
          acc[supplierName] = [];
        }
        acc[supplierName].push({
          date: dayjs(price.valid_from).format("DD/MM/YYYY"),
          price: parseFloat(price.price),
          valid_from: price.valid_from,
          valid_to: price.valid_to,
        });
        return acc;
      },
      {} as Record<
        string,
        Array<{
          date: string;
          price: number;
          valid_from: string;
          valid_to: string | null;
        }>
      >
    );

    // Obter todas as datas únicas e ordenadas
    const allDates = Array.from(
      new Set(priceTrends.map((p) => dayjs(p.valid_from).format("DD/MM/YYYY")))
    ).sort((a: string, b: string) => dayjs(a, "DD/MM/YYYY").diff(dayjs(b, "DD/MM/YYYY")));

    // Criar estrutura de dados para o Recharts
    // Cada objeto representa uma data, com valores para cada fornecedor
    const chartData = allDates.map((date) => {
      const dataPoint: Record<string, string | number | null> = { date: date as string };

      // Para cada fornecedor, encontrar o preço válido nessa data
      Object.keys(groupedBySupplier).forEach((supplier) => {
        const prices = groupedBySupplier[supplier];

        // Encontrar o preço válido para esta data
        // Um preço é válido se valid_from <= date <= valid_to (ou valid_to é null)
        const validPrice = prices.find((p) => {
          const priceDate = dayjs(p.valid_from, "DD/MM/YYYY");
          const currentDate = dayjs(date as string, "DD/MM/YYYY");

          if (p.valid_to) {
            const validToDate = dayjs(p.valid_to);
            return (
              // currentDate.isSameOrAfter(priceDate) &&
              currentDate.isBefore(validToDate)
            );
          }
          // Se valid_to é null, o preço é válido até hoje
          // return currentDate.isSameOrAfter(priceDate);
        });

        dataPoint[supplier] = validPrice ? validPrice.price : null;
      });

      return dataPoint;
    });

    return chartData;
  })();

  // Obter lista de fornecedores únicos
  const suppliers: string[] = Array.from(new Set(priceTrends?.map((p) => p.supplier.name) || []));

  // Estados de loading
  if (loadingIngredients) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Carregando ingredientes...</div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">
          Erro ao carregar dados: {error instanceof Error ? error.message : "Erro desconhecido"}
        </p>
      </div>
    );
  }

  // Estado vazio (sem ingrediente selecionado)
  if (!ingredientId) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-2">
            Selecione um ingrediente para ver a tendência de preços:
          </span>
          <select
            value=""
            onChange={(e) => setIngredientId(Number(e.target.value) || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Selecione um ingrediente --</option>
            {ingredientsResponse?.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} ({ing.unit})
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  // Estado de loading dos preços
  if (loadingPrices) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Carregando tendências de preço...</div>
      </div>
    );
  }

  // Estado vazio (sem dados de preço)
  if (!priceTrends || priceTrends.length === 0) {
    return (
      <div className="p-8 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">Nenhum dado de preço encontrado para este ingrediente.</p>
        <button
          onClick={() => setIngredientId(null)}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Selecionar outro ingrediente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de ingrediente */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Ingrediente:</span>
          <select
            value={ingredientId}
            onChange={(e) => setIngredientId(Number(e.target.value) || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Selecione um ingrediente --</option>
            {ingredientsResponse?.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} ({ing.unit})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Informações do ingrediente selecionado */}
      {ingredientsResponse?.find((ing) => ing.id === ingredientId) && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Ingrediente selecionado:</strong>{" "}
            {ingredientsResponse.find((ing) => ing.id === ingredientId)?.name}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            <strong>Fornecedores:</strong> {suppliers.length} fornecedor(es) encontrado(s)
          </p>
        </div>
      )}

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolução de Preços por Fornecedor</h3>

        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />

            <YAxis
              label={{
                value: "Preço (R$)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
                      <p className="font-semibold text-gray-800 mb-2">{label}</p>
                      {payload.map((entry, index) => {
                        if (entry.value === null) return null;
                        return (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            <strong>{entry.dataKey}:</strong> R$ {Number(entry.value).toFixed(2)}
                          </p>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />

            {/* Linhas para cada fornecedor */}
            {suppliers.map((supplier: string, index: number) => (
              <Line
                key={supplier}
                type="monotone"
                dataKey={supplier}
                stroke={SUPPLIER_COLORS[index % SUPPLIER_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={true} // Conecta pontos mesmo com valores null
                name={supplier}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela de dados (opcional) */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados Detalhados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Válido de
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Válido até
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priceTrends.map((trend) => (
                <tr key={trend.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{trend.supplier.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {parseFloat(trend.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(trend.valid_from).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {trend.valid_to ? dayjs(trend.valid_to).format("DD/MM/YYYY") : "Indefinido"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
