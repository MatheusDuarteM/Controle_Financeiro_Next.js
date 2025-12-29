"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase"; // Importe o cliente auth
import { startOfMonth, endOfMonth } from "date-fns";
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
    redirect("/login"); // Se não tiver logado, manda pro login
  }
  return user;
}

// 1. BUSCAR DADOS
export async function getDadosFinanceiros() {
  const user = await getUsuarioLogado();
  const hoje = new Date();

  // Garante que o usuário existe na tabela PROFILES
  // Usamos o user.id do Supabase Auth
  let perfil = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!perfil) {
    perfil = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email || "sem-email",
        saldo: 0,
      },
    });
  }

  // Busca transações
  const transacoes = await prisma.transaction.findMany({
    where: {
      profileId: user.id, // Usa o ID real
      createdAt: {
        gte: startOfMonth(hoje),
        lte: endOfMonth(hoje),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    saldo: perfil.saldo,
    transacoes: transacoes,
  };
}

// 2. ADICIONAR TRANSAÇÃO
export async function adicionarTransacao(dados: FormData) {
  const user = await getUsuarioLogado(); // Pega ID real
  const descricao = dados.get("descricao") as string;
  const valor = parseFloat(dados.get("valor") as string);
  const tipo = dados.get("tipo") as "entrada" | "saida";

  if (!valor || !descricao) return;

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        descricao,
        valor,
        tipo,
        profileId: user.id, // ID real
      },
    }),
    prisma.profile.update({
      where: { id: user.id },
      data: {
        saldo: {
          increment: tipo === "entrada" ? valor : -valor,
        },
      },
    }),
  ]);

  revalidatePath("/");
}

// 3. EDITAR SALDO MANUALMENTE
export async function atualizarSaldoManual(novoSaldo: number) {
  const user = await getUsuarioLogado(); // Pega ID real

  await prisma.profile.update({
    where: { id: user.id },
    data: { saldo: novoSaldo },
  });
  revalidatePath("/");
}
