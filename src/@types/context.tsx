import { User } from "./user";

export type Context = {
  user: User | null;
  setUser: SetUserType;
};

export type AppContextType = () => Context | null; 

export type SetUserType = (user: User|null) => void