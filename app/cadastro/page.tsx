"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cadastro } from "@/app/auth-actions";
import Link from "next/link";
import { useState } from "react";

export default function CadastroPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Comece a controlar suas finanças hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              setLoading(true);
              await cadastro(formData);
              setLoading(false);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" type="text" placeholder="Seu Nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 font-bold"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-emerald-600 font-bold hover:underline"
            >
              Fazer Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
