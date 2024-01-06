import { User } from "./user";

export type ContextType = {
  user: User | null;
  runner: string;
  alerte: {
    severite: "error" | "warning" | "info" | "success",
    message: string,
  } | null;
  changement: boolean;
};

export type Context = {
  appContext: ContextType;
  setAppContext: SetContextType;
};

export type AppContextType = () => Context | null;

export type SetContextType = (appContext: ContextType) => void;
