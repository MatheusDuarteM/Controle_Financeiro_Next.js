"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

// --- LOGIN COM SUPABASE AUTH ---
export async function login(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { erro: error.message || "Erro ao fazer login" };
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return { erro: "Erro ao fazer login. Tente novamente." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// --- CADASTRO COM SUPABASE AUTH ---
export async function cadastro(nome: string, email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nome },
      },
    });

    if (error) {
      return { erro: error.message || "Erro ao fazer cadastro" };
    }

    // Cria perfil no banco de dados
    if (data.user) {
      try {
        await prisma.profile.create({
          data: {
            id: data.user.id,
            email: email,
            saldo: 0,
          },
        });
      } catch (e) {
        console.error("Erro ao criar perfil:", e);
      }
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return { erro: "Erro ao fazer cadastro. Tente novamente." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// --- LOGOUT ---
export async function logout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return { erro: "Erro ao fazer logout." };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

// --- RESETAR SENHA ---
export async function resetarSenha(email: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/nova-senha`,
    });

    if (error) {
      return { erro: error.message || "Erro ao resetar senha" };
    }

    return { sucesso: "Verifique seu email para redefinir a senha." };
  } catch (error) {
    console.error("Erro ao resetar senha:", error);
    return { erro: "Erro ao resetar senha. Tente novamente." };
  }
}

export async function novaSenha(formData: FormData) {
  const supabase = await createClient();
  const senha = formData.get("senha") as string;

  const { error } = await supabase.auth.updateUser({
    password: senha,
  });

  if (error) {
    return { erro: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
