import { useState } from "react";
import { AppContext } from "./appContext";
import { ChildrenProps, ContextType } from "gec-tripetto";


export function AppContextProvider({ children }: ChildrenProps) {
  const [appContext, setAppContext] = useState<ContextType>({
    user: null,
    runner: "Autoscroll",
    alerte: null,
    changement: false,
  });

  return <AppContext.Provider value={{ appContext, setAppContext }}>{children}</AppContext.Provider>;
}
