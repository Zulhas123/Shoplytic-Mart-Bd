export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  email: string | null;
  name: string;
  address: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};
