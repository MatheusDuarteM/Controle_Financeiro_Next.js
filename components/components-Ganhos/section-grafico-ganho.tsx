"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
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

// Definição do Tipo (igual ao do pai)
type Transacao = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
};

// Interface das Props que o componente recebe
interface SectionGraficoGanhoProps {
  transacoes: Transacao[];
}

const CORES_GANHOS = [
  "#10b981", // Emerald 500
  "#3b82f6", // Blue 500
  "#06b6d4", // Cyan 500
  "#8b5cf6", // Violet 500
  "#6366f1", // Indigo 500
];

const chartConfig = {
  valor: { label: "Valor (R$)" },
  entrada: { label: "Entradas", color: "#10b981" },
  saida: { label: "Saídas", color: "#e11d48" },
} satisfies ChartConfig;

const SectionGraficoGanho = ({ transacoes }: SectionGraficoGanhoProps) => {
  // O cálculo agora é feito com base na prop 'transacoes' recebida
  const dadosGraficoPizzaGanho = useMemo(() => {
    const apenasEntradas = transacoes.filter((t) => t.tipo === "entrada");
    const agrupado2: Record<string, number> = {};

    apenasEntradas.forEach((t) => {
      const desc = t.descricao;
      if (!agrupado2[desc]) agrupado2[desc] = 0;
      agrupado2[desc] += t.valor;
    });

    return Object.entries(agrupado2).map(([key, val], index) => ({
      categoria: key,
      valor: val,
      fill: CORES_GANHOS[index % CORES_GANHOS.length],
    }));
  }, [transacoes]);

  return (
    <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-zinc-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-emerald-500" /> Ganhos por
          Categoria
        </CardTitle>
        <CardDescription>Fontes de renda</CardDescription>
      </CardHeader>
      <CardContent>
        {dadosGraficoPizzaGanho.length > 0 ? (
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
                data={dadosGraficoPizzaGanho}
                dataKey="valor"
                nameKey="categoria"
                innerRadius={60}
                paddingAngle={5}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-zinc-400">
            Nenhum ganho registrado.
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {dadosGraficoPizzaGanho.map((item, idx) => (
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

export default SectionGraficoGanho;
