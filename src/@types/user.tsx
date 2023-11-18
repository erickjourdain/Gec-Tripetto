export type Role = "ADMIN" | "CONTRIBUTEUR" | "USER";

export type User = {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  password?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
