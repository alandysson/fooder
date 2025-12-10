import { useState } from "react";
import dayjs from "dayjs";
import { useFetchFluxoDeTrafego } from "@/hooks/api/useFetchFluxoDeTrafego";

// Nomes dos dias da semana
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Horas do dia (00-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

export function TrafficFlowHeatmap() {
  const [start, setStart] = useState(dayjs().subtract(30, "days").format("YYYY-MM-DD"));
  const [end, setEnd] = useState(dayjs().format("YYYY-MM-DD"));
  const { fluxoDeTrafego: trafficData, isFetching, isError, error } = useFetchFluxoDeTrafego(start, end);

  // Processar dados para o heatmap
  // Estrutura: matriz onde cada linha é um dia e cada coluna é uma hora
  const heatmapData = (() => {
    if (!trafficData || trafficData.length === 0) return [];

    // Criar matriz de dados: cada linha é um dia da semana
    const matrix = WEEKDAYS.map((day, dayIdx) => {
      const dayData: Record<string, number | string> = { day };

      // Para cada hora, buscar o valor correspondente
      HOURS.forEach((hour) => {
        const entry = trafficData.find((d) => d.weekday === dayIdx.toString() && d.hour === hour);
        dayData[hour] = entry ? parseFloat(entry.revenue.toString()) : 0;
      });

      return dayData;
    });

    return matrix;
  })();

  // Calcular valor máximo para normalizar cores
  const maxRevenue = trafficData ? Math.max(...trafficData.map((d) => parseFloat(d.revenue.toString()))) : 0;

  // Função para obter cor baseada na intensidade
  const getColor = (value: number): string => {
    if (value === 0) return "#f3f4f6"; // Cinza claro (sem dados)

    const intensity = value / maxRevenue;

    if (intensity < 0.1) return "#dbeafe"; // Azul muito claro
    if (intensity < 0.25) return "#93c5fd"; // Azul claro
    if (intensity < 0.5) return "#60a5fa"; // Azul médio
    if (intensity < 0.75) return "#3b82f6"; // Azul
    return "#1e40af"; // Azul escuro (maior intensidade)
  };

  const getColorText = (value: number): string => {
    if (value === 0) return "#f3f4f6"; // Cinza claro (sem dados)

    const intensity = value / maxRevenue;

    if (intensity < 0.5) return "#000000"; // Azul médio
    if (intensity < 0.75) return "#ffffff"; // Azul
    return "#ffffff"; // Azul escuro (maior intensidade)
  };

  // Estados de loading e erro
  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Carregando dados de tráfego...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">
          Erro ao carregar dados: {error instanceof Error ? error.message : "Erro desconhecido"}
        </p>
      </div>
    );
  }

  if (!trafficData || trafficData.length === 0) {
    return (
      <div className="p-8 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">Nenhum dado de tráfego encontrado para o período selecionado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros de data */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Data Inicial:</span>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Data Final:</span>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total de Vendas</p>
          <p className="text-2xl font-bold text-blue-900">
            {trafficData.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Receita Total</p>
          <p className="text-2xl font-bold text-green-900">
            R$ {trafficData.reduce((sum, d) => sum + parseFloat(d.revenue.toString()), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Ticket Médio</p>
          <p className="text-2xl font-bold text-purple-900">
            R${" "}
            {(
              trafficData.reduce((sum, d) => sum + parseFloat(d.revenue.toString()), 0) /
              trafficData.reduce((sum, d) => sum + d.sales, 0)
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Heatmap - Opção 1: Tabela HTML (Recomendada - funciona perfeitamente) */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Fluxo de Tráfego por Hora e Dia da Semana
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Cores mais escuras indicam maior receita no período. Passe o mouse sobre as células para ver
          detalhes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-gray-300 bg-gray-50 font-semibold text-sm text-gray-700 sticky left-0 z-10">
                  Dia
                </th>
                {HOURS.map((hour) => (
                  <th
                    key={hour}
                    className="p-2 border border-gray-300 bg-gray-50 text-xs text-gray-600 min-w-[40px]"
                  >
                    {hour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((dayData, dayIdx) => {
                const day = dayData.day as string;
                return (
                  <tr key={day}>
                    <td className="p-2 border border-gray-300 bg-gray-50 font-semibold text-sm text-gray-700 sticky left-0 z-10">
                      {day}
                    </td>
                    {HOURS.map((hour) => {
                      const value = dayData[hour] as number;
                      const fullData = trafficData?.find(
                        (d) => d.weekday === dayIdx.toString() && d.hour === hour
                      );

                      return (
                        <td
                          key={hour}
                          className="p-2 border border-gray-300 text-center text-xs cursor-pointer transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: getColor(value),
                            minWidth: "40px",
                          }}
                          title={
                            fullData
                              ? `${WEEKDAYS_FULL[dayIdx]} ${hour}:00 - Receita: R$ ${value.toFixed(
                                  2
                                )} - Vendas: ${fullData.sales}`
                              : `${WEEKDAYS_FULL[dayIdx]} ${hour}:00 - Sem dados`
                          }
                        >
                          {value > 0 && (
                            <span
                              style={{
                                color: getColorText(value),
                              }}
                              className="font-medium"
                            >
                              R$ {value.toFixed(0)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legenda de cores */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-sm text-gray-600">Menor</span>
          <div className="flex gap-1">
            {[0, 0.1, 0.25, 0.5, 0.75, 1].map((intensity) => (
              <div
                key={intensity}
                className="border border-gray-300"
                style={{
                  width: "30px",
                  height: "20px",
                  backgroundColor: getColor(intensity * maxRevenue),
                }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">Maior</span>
        </div>
      </div>

      {/* Heatmap - Opção 2: BarChart (Alternativa - requer ajustes) */}
      {/* 
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Gráfico de Barras (Alternativa)
        </h3>
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            data={heatmapData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              domain={[0, 23]}
              label={{ value: 'Hora do Dia', position: 'insideBottom', offset: -5 }}
              tick={{ fontSize: 10 }}
              ticks={[0, 4, 8, 12, 16, 20, 23]}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis 
              dataKey="day" 
              type="category"
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const clickedBar = payload.find(p => {
                    const val = p.value as number;
                    return val !== null && val !== undefined && val > 0;
                  });
                  if (!clickedBar) return null;
                  const hour = clickedBar.dataKey as string;
                  const revenue = clickedBar.value as number;
                  const fullData = trafficData.find(
                    (d) => d.weekday === WEEKDAYS.indexOf(label).toString() && d.hour === hour
                  );
                  return (
                    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
                      <p className="font-semibold text-gray-800 mb-2">
                        {WEEKDAYS_FULL[WEEKDAYS.indexOf(label)]} - {hour}:00
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Receita:</strong> R$ {Number(revenue).toFixed(2)}
                      </p>
                      {fullData && (
                        <p className="text-sm text-gray-700">
                          <strong>Vendas:</strong> {fullData.sales} unidade(s)
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {HOURS.map((hour) => (
              <Bar 
                key={hour} 
                dataKey={hour} 
                fill={getColor(0)}
                isAnimationActive={false}
              >
                {heatmapData.map((entry, entryIdx) => {
                  const value = entry[hour] as number;
                  return (
                    <Cell
                      key={`cell-${entryIdx}-${hour}`}
                      fill={getColor(value)}
                    />
                  );
                })}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      */}

      {/* Tabela de dados (opcional) */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados Detalhados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dia
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Médio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trafficData
                .sort((a, b) => {
                  if (a.weekday !== b.weekday) {
                    return parseInt(a.weekday) - parseInt(b.weekday);
                  }
                  return parseInt(a.hour) - parseInt(b.hour);
                })
                .map((data, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {WEEKDAYS_FULL[parseInt(data.weekday)]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{data.hour}:00</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      R$ {parseFloat(data.revenue.toString()).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{data.sales}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      R$ {(parseFloat(data.revenue.toString()) / data.sales).toFixed(2)}
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
