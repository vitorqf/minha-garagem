"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseFormFields } from "@/features/expenses/components/expense-form-fields";
import {
  initialExpenseFormState,
  type ExpenseFormState,
  type ExpenseViewModel,
  type VehicleOption,
} from "@/features/expenses/types";

type ExpenseMutationAction = (
  state: ExpenseFormState,
  formData: FormData,
) => Promise<ExpenseFormState>;

type ExpenseDeleteAction = (formData: FormData) => Promise<void>;

type ExpensesListProps = {
  expenses: ExpenseViewModel[];
  vehicles: VehicleOption[];
  updateExpenseAction: ExpenseMutationAction;
  deleteExpenseAction: ExpenseDeleteAction;
};

function SubmitButton({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

function formatDate(input: string) {
  const date = new Date(`${input}T00:00:00Z`);
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function ExpensesList({
  expenses,
  vehicles,
  updateExpenseAction,
  deleteExpenseAction,
}: ExpensesListProps) {
  const [editingExpense, setEditingExpense] = useState<ExpenseViewModel | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseViewModel | null>(null);
  const [updateState, updateFormAction] = useActionState(
    async (previousState: ExpenseFormState, formData: FormData) => {
      const result = await updateExpenseAction(previousState, formData);
      if (result.status === "success") {
        setEditingExpense(null);
      }
      return result;
    },
    initialExpenseFormState,
  );

  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort((a, b) => {
        const dateDiff = Date.parse(b.expenseDate) - Date.parse(a.expenseDate);
        if (dateDiff !== 0) {
          return dateDiff;
        }
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      }),
    [expenses],
  );

  if (sortedExpenses.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-[#CCD7E8] bg-[#F8FBFF] p-8 text-center">
        <p className="text-base text-[#5E7391]">Nenhuma despesa encontrada no período selecionado.</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor (R$)</TableHead>
            <TableHead>KM</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedExpenses.map((expense) => (
            <TableRow key={expense.id} data-testid="expense-row">
              <TableCell data-testid="expense-row-title" className="text-base font-medium text-[#324864]">
                {formatDate(expense.expenseDate)}
              </TableCell>
              <TableCell className="text-base font-bold text-[#132039]">{expense.vehicleLabel}</TableCell>
              <TableCell>
                <Badge variant={expense.category}>{expense.category === "fuel" ? "Combustível" : expense.category === "parts" ? "Peças" : "Serviço"}</Badge>
              </TableCell>
              <TableCell className="text-xl font-extrabold text-[#131F37]">{expense.amountLabel}</TableCell>
              <TableCell>{expense.mileage ? expense.mileage.toLocaleString("pt-BR") : "—"}</TableCell>
              <TableCell className="max-w-80 truncate">{expense.notes ?? "—"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-grid size-9 place-items-center rounded-full text-[#8EA1BC] hover:bg-[#EEF3FA]"
                      aria-label={`Ações da despesa ${expense.id}`}
                    >
                      <MoreVertical className="size-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditingExpense(expense)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDeletingExpense(expense)}>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-[#E4EAF4] px-4 py-3 text-sm text-[#5D7290]">
        <p>Mostrando 1-{Math.min(sortedExpenses.length, 12)} de {sortedExpenses.length} gastos</p>
        <div className="flex items-center gap-2">
          <button type="button" disabled className="grid size-8 place-items-center rounded-full text-[#9DB0C9]">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" aria-current="page" className="grid size-8 place-items-center rounded-full bg-[#2F84EB] text-sm font-bold text-white">
            1
          </button>
          <button type="button" disabled className="grid size-8 place-items-center rounded-full text-[#9DB0C9]">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <Dialog open={Boolean(editingExpense)} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Gasto</DialogTitle>
            <DialogDescription>Atualize os dados da despesa selecionada.</DialogDescription>
          </DialogHeader>

          {editingExpense ? (
            <form action={updateFormAction} className="space-y-4">
              <input type="hidden" name="id" value={editingExpense.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <ExpenseFormFields
                  idPrefix={`edit-${editingExpense.id}`}
                  vehicles={vehicles}
                  values={{
                    vehicleId: editingExpense.vehicleId,
                    expenseDate: editingExpense.expenseDate,
                    category: editingExpense.category,
                    amountInput: (editingExpense.amountCents / 100).toFixed(2).replace(".", ","),
                    mileage: editingExpense.mileage,
                    notes: editingExpense.notes,
                  }}
                  errors={updateState.errors}
                />
              </div>

              <DialogFooter className="justify-between sm:justify-between">
                <Button type="button" variant="outline" className="h-12 min-w-44 text-base" onClick={() => setEditingExpense(null)}>
                  Cancelar
                </Button>
                <SubmitButton
                  label="Salvar Gasto"
                  pendingLabel="Salvando..."
                  className="h-12 min-w-44 text-base font-bold"
                />
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deletingExpense)} onOpenChange={(open) => !open && setDeletingExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir despesa</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação remove a despesa selecionada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletingExpense ? (
            <form action={deleteExpenseAction} className="space-y-2">
              <input type="hidden" name="id" value={deletingExpense.id} />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction type="submit">Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
