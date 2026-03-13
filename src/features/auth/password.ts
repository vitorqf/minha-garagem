import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPasswordHash(
  inputPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(inputPassword, passwordHash);
}
