import type { User } from "@/domain/entities/User";

export type CreateUserInput = {
  email?: string | null;
  passwordHash: string;
  name: string;
  address?: string | null;
  role?: "USER" | "ADMIN";
};

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>;
  findByName(name: string): Promise<(User & { passwordHash: string }) | null>;
  findById(id: string): Promise<User | null>;
  list(): Promise<User[]>;
  updateProfile(userId: string, input: { name: string; address?: string | null }): Promise<User>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
}
