
import { User } from "./user";

export type FormResponse = {
  id?: number;
  titre: string;
  slug: string;
  description: string | null;
  formulaire?: string;
  createur?: User;
  valide: boolean;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
}