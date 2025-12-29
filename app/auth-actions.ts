"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";

// --- LOGIN ---
export async function login(formData: FormData) {
  console.log("--> Tentando fazer Login..."); // LOG 1

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Erro no Supabase Login:", error.message); // LOG DE ERRO
    return { erro: error.message };
  }

  console.log("Login Sucesso! Redirecionando...");
  revalidatePath("/", "layout");
  redirect("/");
}

// --- CADASTRO ---
export async function cadastro(formData: FormData) {
  console.log("--> Tentando fazer Cadastro..."); // LOG 2

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nome = formData.get("nome") as string;

  // 1. Cria usuário no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: nome },
    },
  });

  if (error) {
    console.error("Erro no Supabase Cadastro:", error.message); // LOG DE ERRO
    return { erro: error.message };
  }

  // 2. Cria perfil no Banco (Prisma)
  if (data.user) {
    try {
      console.log("Criando perfil no Prisma...");
      await prisma.profile.create({
        data: {
          id: data.user.id,
          email: email,
          saldo: 0,
        },
      });
      console.log("Perfil criado com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar no Prisma:", e); // LOG DE ERRO PRISMA
      // Não retornamos erro aqui para não travar o login se o user já existir
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// --- LOGOUT ---
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetarSenha(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;

  const { error } = await (
    await supabase
  ).auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nova-senha`,
  });

  if (error) {
    return { erro: error.message };
  }

  return { sucesso: "Verifique seu email para redefinir a senha." };
}

export async function novaSenha(formData: FormData) {
  const supabase = createClient();
  const senha = formData.get("senha") as string;
  const token = formData.get("token") as string;

  const { error } = await (
    await supabase
  ).auth.updateUser({
    password: senha,
  });

  if (error) {
    return { erro: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
