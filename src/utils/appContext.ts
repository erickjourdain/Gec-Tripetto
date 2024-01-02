import { Context } from "gec-tripetto";
import { createContext, useContext } from "react";

export const AppContext = createContext<Context | null>(null);

export const useAppContext = () => useContext(AppContext);
