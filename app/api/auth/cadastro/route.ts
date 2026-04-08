import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: any;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Cadastro body parse error:", error);
    return NextResponse.json(
      { erro: "Dados de cadastro inválidos" },
      { status: 400 },
    );
  }

  const nome = body?.nome?.toString() ?? "";
  const email = body?.email?.toString() ?? "";
  const password = body?.password?.toString() ?? "";

  if (!nome || !email || !password) {
    return NextResponse.json(
      { erro: "Nome, email e senha são obrigatórios" },
      { status: 400 },
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.error("Supabase env vars missing", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "missing",
    });
    return NextResponse.json(
      { erro: "Erro de configuração do Supabase" },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: nome },
    },
  });

  if (error) {
    return NextResponse.json(
      { erro: error.message || "Erro ao fazer cadastro" },
      { status: 400 },
    );
  }

  if (data.user) {
    try {
      await prisma.profile.create({
        data: {
          id: data.user.id,
          email,
          saldo: 0,
        },
      });
    } catch (e) {
      console.error("Erro ao criar perfil:", e);
      return NextResponse.json(
        { erro: "Erro ao criar perfil de usuário" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ sucesso: true });
}
