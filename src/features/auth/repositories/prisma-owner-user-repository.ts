import { prisma } from "@/lib/prisma";
import type { OwnerUserRepository, OwnerUserCreateData } from "@/features/auth/repositories/owner-user-repository";
import type { OwnerUser } from "@/features/auth/types";

function toOwnerUser(input: {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}): OwnerUser {
  return {
    id: input.id,
    email: input.email,
    passwordHash: input.passwordHash,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}

export class PrismaOwnerUserRepository implements OwnerUserRepository {
  async count(): Promise<number> {
    return prisma.user.count();
  }

  async findByEmail(email: string): Promise<OwnerUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return null;
    }

    return toOwnerUser(user);
  }

  async create(data: OwnerUserCreateData): Promise<OwnerUser> {
    const user = await prisma.user.create({
      data: {
        email: data.email.trim().toLowerCase(),
        passwordHash: data.passwordHash,
      },
    });

    return toOwnerUser(user);
  }
}
