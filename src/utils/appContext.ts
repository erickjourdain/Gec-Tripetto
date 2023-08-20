import { createContext, useContext } from "react";
import { Context } from "../@types/context";

export const AppContext = createContext<Context|null>(null); 

export const useAppContext = () => useContext(AppContext);