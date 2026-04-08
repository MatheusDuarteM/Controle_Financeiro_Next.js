import { getDadosFinanceiros, getMesesComTransacoes } from "./actions";

import SectionQuadrado1 from "@/components/components-quadrado1/section-quadrado1";
import SectionQuadrado2 from "@/components/components-quadrado2/section-quadrado2";
import SectionGraficoDespesas from "@/components/components-Despesas/section-grafico-despesas";
import SectionGraficoGanho from "@/components/components-Ganhos/section-grafico-ganho";
import SeletorMes from "../components/seletor-mes";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}) {
  const { mes, ano } = await searchParams;
  const mesParam = mes ? parseInt(mes) : undefined;
  const anoParam = ano ? parseInt(ano) : undefined;

  const { saldo, transacoes } = await getDadosFinanceiros(mesParam, anoParam);
  const mesesDisponíveis = await getMesesComTransacoes();

  const transacoesFormatadas = transacoes.map((t) => ({
    id: t.id,
    descricao: t.descricao,
    valor: t.valor,
    tipo: t.tipo as "entrada" | "saida",
  }));

  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex flex-col items-center font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Financeiro
          </h1>
          <p className="text-zinc-500 text-sm">Controle seus gastos mensais</p>
        </div>
      </div>

      {/* Seletor de Mês */}
      <div className="w-full max-w-6xl mb-6">
        <SeletorMes meses={mesesDisponíveis} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl items-start">
        <SectionQuadrado1 saldo={saldo} transacoes={transacoesFormatadas} />
        <SectionQuadrado2 saldo={saldo} transacoes={transacoesFormatadas} />
        <SectionGraficoDespesas transacoes={transacoesFormatadas} />
        <SectionGraficoGanho transacoes={transacoesFormatadas} />
      </div>
    </div>
  );
}
