import type { OwnerUserRepository, OwnerUserCreateData } from "@/features/auth/repositories/owner-user-repository";
import type { OwnerUser } from "@/features/auth/types";

export class InMemoryOwnerUserRepository implements OwnerUserRepository {
  private users: OwnerUser[] = [];

  async count(): Promise<number> {
    return this.users.length;
  }

  async findByEmail(email: string): Promise<OwnerUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.users.find((user) => user.email === normalizedEmail) ?? null;
  }

  async create(data: OwnerUserCreateData): Promise<OwnerUser> {
    const timestamp = new Date();
    const user: OwnerUser = {
      id: crypto.randomUUID(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.users.push(user);
    return user;
  }
}
