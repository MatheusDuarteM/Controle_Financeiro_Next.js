"use client";

import { useMemo } from "react";
import { BarChart3 } from "lucide-react"; // Ícone
import { Bar, BarChart, XAxis, CartesianGrid, Cell } from "recharts"; // Componentes do Gráfico
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Definição do Tipo
type Transacao = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
};

// Interface das Props (precisa do saldo também para o cálculo)
interface SectionQuadrado2Props {
  saldo: number;
  transacoes: Transacao[];
}

const chartConfig = {
  valor: { label: "Valor (R$)" },
  entrada: { label: "Entradas", color: "#10b981" },
  saida: { label: "Saídas", color: "#e11d48" },
} satisfies ChartConfig;

const SectionQuadrado2 = ({ saldo, transacoes }: SectionQuadrado2Props) => {
  // Cálculo movido do pai para cá
  const dadosGraficoBarras = useMemo(() => {
    const totalSaidas = transacoes
      .filter((t) => t.tipo === "saida")
      .reduce((acc, curr) => acc + curr.valor, 0);

    // Lógica: Se Saldo Atual = Entradas - Saídas, então Entradas = Saldo Atual + Saídas
    const totalEntradasCalculado = saldo + totalSaidas;

    return [
      { category: "Entradas", valor: totalEntradasCalculado, tipo: "entrada" },
      { category: "Saídas", valor: totalSaidas, tipo: "saida" },
    ];
  }, [transacoes, saldo]);

  return (
    <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-zinc-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-zinc-500" /> Balanço Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={dadosGraficoBarras}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-zinc-200"
            />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
              {dadosGraficoBarras.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.tipo === "entrada"
                      ? chartConfig.entrada.color
                      : chartConfig.saida.color
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SectionQuadrado2;
