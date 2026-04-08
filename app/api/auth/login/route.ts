import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: any;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Login body parse error:", error);
    return NextResponse.json(
      { erro: "Dados de login inválidos" },
      { status: 400 },
    );
  }

  const email = body?.email?.toString() ?? "";
  const password = body?.password?.toString() ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { erro: "Email e senha são obrigatórios" },
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
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { erro: error.message || "Erro ao fazer login" },
      { status: 400 },
    );
  }

  return NextResponse.json({ sucesso: true });
}
