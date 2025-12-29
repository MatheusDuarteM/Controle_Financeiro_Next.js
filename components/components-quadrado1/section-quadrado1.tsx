"use client"; // Este componente continua sendo Cliente pois tem Modais

import { useState } from "react";
import {
  Wallet,
  Pencil,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogo"; // Confirme se o caminho é 'dialog' ou 'dialogo'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// IMPORTANTE: Importar as Server Actions
import { adicionarTransacao, atualizarSaldoManual } from "@/app/actions";

// Definição do Tipo
type Transacao = {
  id: number;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
};

interface SectionQuadrado1Props {
  saldo: number;
  transacoes: Transacao[];
  // Removemos setSaldo e setTransacoes, pois agora o banco cuida disso
}

const SectionQuadrado1 = ({ saldo, transacoes }: SectionQuadrado1Props) => {
  // Controle dos Modais (Visibilidade)
  const [openDeposito, setOpenDeposito] = useState(false);
  const [openGasto, setOpenGasto] = useState(false);
  const [openEditorSaldo, setOpenEditorSaldo] = useState(false);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-zinc-200 dark:bg-zinc-900/80 dark:ring-zinc-800">
      <CardHeader className="space-y-1 text-center pb-2">
        <CardTitle className="text-sm font-medium text-black uppercase tracking-widest flex items-center justify-center gap-2 ">
          <Wallet className="h-4 w-4" />
          Saldo Atual
        </CardTitle>
        <div className="flex items-center justify-center gap-2">
          {/* Mostra o saldo vindo do Banco */}
          <span className="text-5xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">
            {formatarMoeda(saldo)}
          </span>

          {/* EDITAR SALDO (LÁPIS) */}
          <Dialog open={openEditorSaldo} onOpenChange={setOpenEditorSaldo}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-zinc-100"
              >
                <Pencil className="h-4 w-4 text-zinc-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              {/* Usamos 'action' para chamar o servidor diretamente */}
              <form
                action={async (formData) => {
                  const novoSaldo = parseFloat(
                    formData.get("novoSaldo") as string
                  );
                  await atualizarSaldoManual(novoSaldo); // Chama o banco
                  setOpenEditorSaldo(false); // Fecha o modal
                }}
              >
                <DialogHeader>
                  <DialogTitle>Ajustar Saldo Inicial</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Novo Saldo (R$)</Label>
                    <Input
                      name="novoSaldo"
                      step="0.01"
                      type="number"
                      defaultValue={saldo}
                      required
                      className="text-lg font-bold"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="font-bold bg-emerald-600 text-white"
                  >
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            <TrendingUp className="h-3 w-3" /> Carteira Ativa
          </span>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 pt-6">
        <div className="grid grid-cols-2 gap-4">
          {/* BOTÃO DEPOSITAR */}
          <Dialog open={openDeposito} onOpenChange={setOpenDeposito}>
            <DialogTrigger asChild>
              <Button
                className="h-24 flex-col gap-2 rounded-xl border-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                variant="outline"
              >
                <ArrowUpCircle className="h-8 w-8" />{" "}
                <span className="font-bold">Depositar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                action={async (formData) => {
                  // Injetamos o tipo 'entrada' no formData
                  formData.append("tipo", "entrada");
                  await adicionarTransacao(formData); // Chama o banco
                  setOpenDeposito(false); // Fecha o modal
                }}
              >
                <DialogHeader>
                  <DialogTitle>Adicionar Receita</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Valor (R$)</Label>
                    <Input name="valor" step="0.01" type="number" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Descrição</Label>
                    <Input
                      name="descricao"
                      placeholder="Ex: Salário"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-emerald-600 text-white font-bold"
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* BOTÃO GASTAR */}
          <Dialog open={openGasto} onOpenChange={setOpenGasto}>
            <DialogTrigger asChild>
              <Button
                className="h-24 flex-col gap-2 rounded-xl border-0 bg-rose-50 text-rose-700 hover:bg-rose-100 shadow-sm"
                variant="outline"
              >
                <ArrowDownCircle className="h-8 w-8" />{" "}
                <span className="font-bold">Gastar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                action={async (formData) => {
                  // Injetamos o tipo 'saida' no formData
                  formData.append("tipo", "saida");
                  await adicionarTransacao(formData); // Chama o banco
                  setOpenGasto(false); // Fecha o modal
                }}
              >
                <DialogHeader>
                  <DialogTitle>Registrar Despesa</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Valor (R$)</Label>
                    <Input name="valor" step="0.01" type="number" required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Descrição</Label>
                    <Input
                      name="descricao"
                      placeholder="Ex: Mercado"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="bg-red-600 text-white font-bold"
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LISTA DE HISTÓRICO */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-black uppercase font-bold">
            Histórico recente
          </p>
          <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1">
            {transacoes.length === 0 && (
              <p className="text-center text-sm text-black py-4">
                Sem movimentações.
              </p>
            )}
            {transacoes.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      item.tipo === "entrada"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {item.tipo === "entrada" ? (
                      <ArrowUpCircle size={16} />
                    ) : (
                      <ArrowDownCircle size={16} />
                    )}
                  </div>
                  <span className="font-medium">{item.descricao}</span>
                </div>
                <span
                  className={`font-bold ${
                    item.tipo === "entrada"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {item.tipo === "entrada" ? "+" : "-"}{" "}
                  {formatarMoeda(item.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionQuadrado1;
