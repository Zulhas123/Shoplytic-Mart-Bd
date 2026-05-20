export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  name: string;
  address: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

