import type { OwnerUser } from "@/features/auth/types";

export type OwnerUserCreateData = {
  email: string;
  passwordHash: string;
};

export interface OwnerUserRepository {
  count(): Promise<number>;
  findByEmail(email: string): Promise<OwnerUser | null>;
  create(data: OwnerUserCreateData): Promise<OwnerUser>;
}
