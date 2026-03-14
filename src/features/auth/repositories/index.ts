import type { OwnerUserRepository } from "@/features/auth/repositories/owner-user-repository";
import { InMemoryOwnerUserRepository } from "@/features/auth/repositories/in-memory-owner-user-repository";
import { PrismaOwnerUserRepository } from "@/features/auth/repositories/prisma-owner-user-repository";

const globalForOwnerUserRepository = globalThis as unknown as {
  ownerUserMemoryRepository: InMemoryOwnerUserRepository | undefined;
  ownerUserPrismaRepository: PrismaOwnerUserRepository | undefined;
};

const memoryRepository =
  globalForOwnerUserRepository.ownerUserMemoryRepository ?? new InMemoryOwnerUserRepository();
const prismaRepository =
  globalForOwnerUserRepository.ownerUserPrismaRepository ?? new PrismaOwnerUserRepository();

if (process.env.NODE_ENV !== "production") {
  globalForOwnerUserRepository.ownerUserMemoryRepository = memoryRepository;
  globalForOwnerUserRepository.ownerUserPrismaRepository = prismaRepository;
}

export function getOwnerUserRepository(): OwnerUserRepository {
  if (process.env.USER_REPOSITORY === "memory" || process.env.VEHICLE_REPOSITORY === "memory") {
    return memoryRepository;
  }

  return prismaRepository;
}
