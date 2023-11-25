import { FormAPI } from "./formAPI";
import { User } from "./user";

export type AnswerAPI = {
  id: number;
  uuid: string;
  formulaire: FormAPI;
  reponse: string;
  createur: User;
  gestionnaire: User;
  demande: number | null;
  opportunite: number | null;
  statut: string;
  version: number;
  courante: boolean;
  utilisateur?: User;
  lockedAt?: number;
  createdAt?: number;
  updatedAt?: number;
};
