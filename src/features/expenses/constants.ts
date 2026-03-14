export const EXPENSE_COPY = {
  requiredVehicle: "Veículo é obrigatório.",
  requiredDate: "Data é obrigatória.",
  requiredCategory: "Categoria é obrigatória.",
  invalidCategory: "Categoria inválida.",
  requiredAmount: "Valor é obrigatório.",
  invalidAmount: "Valor inválido.",
  invalidMileage: "Quilometragem deve ser um inteiro positivo.",
  invalidNotes: "Observações devem ter no máximo 500 caracteres.",
  invalidPeriod: "Período inválido. A data inicial deve ser menor ou igual à final.",
  genericError: "Não foi possível salvar a despesa.",
  created: "Despesa cadastrada com sucesso.",
  updated: "Despesa atualizada com sucesso.",
  deleted: "Despesa removida com sucesso.",
  notFound: "Despesa não encontrada.",
  vehicleNotFound: "Veículo não encontrado.",
  vehicleHasExpenses: "Não é possível remover o veículo porque ele possui despesas vinculadas.",
} as const;

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  fuel: "Combustível",
  parts: "Peças",
  service: "Serviços",
};
