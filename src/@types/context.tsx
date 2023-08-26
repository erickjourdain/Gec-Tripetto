import { User } from "./user";

export type ContextType = {
  user: User | null;
  runner: string;
};

export type Context = {
  appContext: ContextType;
  setAppContext: SetContextType;
};

export type AppContextType = () => Context | null;

export type SetContextType = (appContext: ContextType) => void;
