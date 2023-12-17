export type Role = "ADMIN" | "CREATOR" | "CONTRIBUTOR" | "USER";

export type User = {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  password?: string;
  valide: boolean;
  bloque: boolean;
  role: Role;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};
