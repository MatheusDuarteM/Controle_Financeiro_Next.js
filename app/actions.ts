"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Função auxiliar para pegar o usuário logado
async function getUsuarioLogado() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}

// 1. BUSCAR DADOS COM FILTRO DE MÊS
export async function getDadosFinanceiros(mes?: number, ano?: number) {
  const user = await getUsuarioLogado();
  const hoje = new Date();

  // Se não especificar mês/ano, usa o mês atual
  const mesAtual = mes ?? hoje.getMonth() + 1;
  const anoAtual = ano ?? hoje.getFullYear();

  // Cria range de datas para o mês/ano
  const primeiroDia = new Date(anoAtual, mesAtual - 1, 1);
  const ultimoDia = new Date(anoAtual, mesAtual, 0);

  try {
    // Busca transações do mês especificado - usando profileId como referência do usuário
    const transacoes = await prisma.transaction.findMany({
      where: {
        profileId: user.id,
        createdAt: {
          gte: primeiroDia,
          lte: ultimoDia,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calcula saldo filtrando transações do mês
    const saldo = transacoes.reduce((acc, t) => {
      return t.tipo === "entrada" ? acc + t.valor : acc - t.valor;
    }, 0);

    return {
      saldo,
      transacoes,
      mesAtual,
      anoAtual,
    };
  } catch (error) {
    console.error("Erro ao buscar dados financeiros:", error);
    return {
      saldo: 0,
      transacoes: [],
      mesAtual,
      anoAtual,
    };
  }
}

// 2. ADICIONAR TRANSAÇÃO
export async function adicionarTransacao(
  descricao: string,
  valor: number,
  tipo: "entrada" | "saida",
  mes?: number,
  ano?: number,
) {
  const user = await getUsuarioLogado();
  const hoje = new Date();

  if (!valor || !descricao) {
    return { erro: "Descrição e valor são obrigatórios" };
  }

  try {
    // Cria data para a transação
    const mesAtual = mes ?? hoje.getMonth() + 1;
    const anoAtual = ano ?? hoje.getFullYear();
    const dataTransacao = new Date(anoAtual, mesAtual - 1, hoje.getDate());

    await prisma.transaction.create({
      data: {
        descricao,
        valor,
        tipo,
        profileId: user.id,
        createdAt: dataTransacao,
      },
    });

    revalidatePath("/");
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    return { erro: "Erro ao adicionar transação" };
  }
}

// 3. DELETAR TRANSAÇÃO
export async function deletarTransacao(transacaoId: number) {
  const user = await getUsuarioLogado();

  try {
    // Verifica se a transação pertence ao usuário
    const transacao = await prisma.transaction.findUnique({
      where: { id: transacaoId },
    });

    if (!transacao || transacao.profileId !== user.id) {
      return { erro: "Transação não encontrada" };
    }

    await prisma.transaction.delete({
      where: { id: transacaoId },
    });

    revalidatePath("/");
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return { erro: "Erro ao deletar transação" };
  }
}

// 4. EDITAR TRANSAÇÃO
export async function editarTransacao(
  transacaoId: number,
  descricao: string,
  valor: number,
  tipo: "entrada" | "saida",
) {
  const user = await getUsuarioLogado();

  try {
    // Verifica se a transação pertence ao usuário
    const transacao = await prisma.transaction.findUnique({
      where: { id: transacaoId },
    });

    if (!transacao || transacao.profileId !== user.id) {
      return { erro: "Transação não encontrada" };
    }

    await prisma.transaction.update({
      where: { id: transacaoId },
      data: {
        descricao,
        valor,
        tipo,
      },
    });

    revalidatePath("/");
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao editar transação:", error);
    return { erro: "Erro ao editar transação" };
  }
}

// 5. ATUALIZAR SALDO MANUALMENTE
export async function atualizarSaldoManual(novoSaldo: number) {
  const user = await getUsuarioLogado();

  try {
    await prisma.profile.updateMany({
      where: { id: user.id },
      data: { saldo: novoSaldo },
    });

    revalidatePath("/");
    return { sucesso: true };
  } catch (error) {
    console.error("Erro ao atualizar saldo manualmente:", error);
    return { erro: "Erro ao atualizar saldo." };
  }
}

// 6. BUSCAR MESES COM TRANSAÇÕES
export async function getMesesComTransacoes(): Promise<
  Array<{ mes: number; ano: number }>
> {
  const user = await getUsuarioLogado();

  try {
    // Busca todas as transações do usuário
    const transacoes = await prisma.transaction.findMany({
      where: { profileId: user.id },
      select: { createdAt: true },
    });

    // Agrupa por mês/ano
    const mesesMap = new Map<string, { mes: number; ano: number }>();

    transacoes.forEach((t) => {
      const mes = t.createdAt.getMonth() + 1;
      const ano = t.createdAt.getFullYear();
      const key = `${ano}-${mes}`;
      if (!mesesMap.has(key)) {
        mesesMap.set(key, { mes, ano });
      }
    });

    // Converte para array e ordena
    const meses = Array.from(mesesMap.values()).sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.mes - a.mes;
    });

    return meses;
  } catch (error) {
    console.error("Erro ao buscar meses:", error);
    return [];
  }
}
