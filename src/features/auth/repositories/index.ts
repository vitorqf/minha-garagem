import type { OwnerUserRepository } from "@/features/auth/repositories/owner-user-repository";
import { InMemoryOwnerUserRepository } from "@/features/auth/repositories/in-memory-owner-user-repository";
import { PrismaOwnerUserRepository } from "@/features/auth/repositories/prisma-owner-user-repository";

const memoryRepository = new InMemoryOwnerUserRepository();
const prismaRepository = new PrismaOwnerUserRepository();

export function getOwnerUserRepository(): OwnerUserRepository {
  if (process.env.USER_REPOSITORY === "memory" || process.env.VEHICLE_REPOSITORY === "memory") {
    return memoryRepository;
  }

  return prismaRepository;
}
