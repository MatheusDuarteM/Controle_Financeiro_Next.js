import { getDadosFinanceiros } from "./actions";
import { logout } from "./auth-actions"; // Importamos a função de logout
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Componentes
import SectionQuadrado1 from "@/components/components-quadrado1/section-quadrado1";
import SectionQuadrado2 from "@/components/components-quadrado2/section-quadrado2";
import SectionGraficoDespesas from "@/components/components-Despesas/section-grafico-despesas";
import SectionGraficoGanho from "@/components/components-Ganhos/section-grafico-ganho";

export default async function Home() {
  // 1. BUSCAR DADOS DO BANCO (Protegido por autenticação)
  // Se não estiver logado, o 'getDadosFinanceiros' redireciona para /login automaticamente
  const { saldo, transacoes } = await getDadosFinanceiros();

  // 2. FORMATAÇÃO
  const transacoesFormatadas = transacoes.map((t) => ({
    id: t.id,
    descricao: t.descricao,
    valor: t.valor,
    tipo: t.tipo as "entrada" | "saida",
  }));

  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex flex-col items-center font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* CABEÇALHO: Título e Botão de Logout */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Financeiro
          </h1>
          <p className="text-zinc-500 text-sm">Controle seus gastos mensais</p>
        </div>

        {/* Formulário para Logout (Server Action) */}
        <form action={logout}>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-2"
          >
            <LogOut size={16} />
            Sair
          </Button>
        </form>
      </div>

      {/* GRID DE CONTEÚDO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl items-start">
        {/* --- QUADRADO 1: SALDO E AÇÕES --- */}
        <SectionQuadrado1 saldo={saldo} transacoes={transacoesFormatadas} />

        {/* --- QUADRADO 2: BALANÇO MENSAL --- */}
        <SectionQuadrado2 saldo={saldo} transacoes={transacoesFormatadas} />

        {/* --- QUADRADO 3: DESPESAS POR CATEGORIA --- */}
        <SectionGraficoDespesas transacoes={transacoesFormatadas} />

        {/* --- QUADRADO 4: GANHOS POR CATEGORIA --- */}
        <SectionGraficoGanho transacoes={transacoesFormatadas} />
      </div>
    </div>
  );
}
