import type { User } from "@/domain/entities/User";

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  name: string;
  address?: string | null;
  role?: "USER" | "ADMIN";
};

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<(User & { passwordHash: string }) | null>;
  findById(id: string): Promise<User | null>;
  list(): Promise<User[]>;
  updateProfile(userId: string, input: { name: string; address?: string | null }): Promise<User>;
}

