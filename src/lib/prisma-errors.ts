type PrismaErrorWithCode = {
  code?: unknown;
};

function hasPrismaCode(error: unknown): error is PrismaErrorWithCode {
  return typeof error === "object" && error !== null && "code" in error;
}

export function isPrismaUniqueConstraintError(error: unknown): boolean {
  return hasPrismaCode(error) && error.code === "P2002";
}
