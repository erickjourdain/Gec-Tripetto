import { User } from "./user";

export type lockAPI = {
  id: number;
  lockedAt: number;
  utilisateur: User;
}