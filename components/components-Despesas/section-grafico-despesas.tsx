"use client";

import { useMemo } from "react";
import { PieChart as PieChartIcon } from "lucide-react"; // Icone
import { Pie, PieChart } from "recharts"; // Gráfico
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Definição do Tipo
type Transacao = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
};

interface SectionGraficoDespesasProps {
  transacoes: Transacao[];
}

// Cores para o gráfico de pizza (DESPESAS - Tons Quentes)
const CORES_DESPESAS = [
  "#e11d48", // Rose 600
  "#f97316", // Orange 500
  "#ef4444", // Red 500
  "#eab308", // Yellow 500
  "#dc2626", // Red 600
];

const chartConfig = {
  valor: { label: "Valor (R$)" },
  saida: { label: "Saídas", color: "#e11d48" },
} satisfies ChartConfig;

const SectionGraficoDespesas = ({
  transacoes,
}: SectionGraficoDespesasProps) => {
  const dadosGraficoPizzaDespesa = useMemo(() => {
    const apenasSaidas = transacoes.filter((t) => t.tipo === "saida");
    const agrupado: Record<string, number> = {};

    apenasSaidas.forEach((t) => {
      const desc = t.descricao;
      if (!agrupado[desc]) agrupado[desc] = 0;
      agrupado[desc] += t.valor;
    });

    return Object.entries(agrupado).map(([key, val], index) => ({
      categoria: key,
      valor: val,
      fill: CORES_DESPESAS[index % CORES_DESPESAS.length],
    }));
  }, [transacoes]);

  return (
    <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-zinc-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PieChartIcon className="h-5 w-5 text-zinc-500" /> Despesas por
          Categoria
        </CardTitle>
        <CardDescription>Para onde o dinheiro foi</CardDescription>
      </CardHeader>
      <CardContent>
        {dadosGraficoPizzaDespesa.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={dadosGraficoPizzaDespesa}
                dataKey="valor"
                nameKey="categoria"
                innerRadius={60}
                paddingAngle={5}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-zinc-400">
            Nenhuma despesa registrada.
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {dadosGraficoPizzaDespesa.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 text-xs text-zinc-600"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: item.fill }}
              ></div>
              {item.categoria}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionGraficoDespesas;
