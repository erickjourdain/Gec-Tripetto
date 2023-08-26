import { useState } from "react";

import { AppContext } from "./appContext";
import { ChildrenProps } from "../@types/childrenProps";
import { ContextType } from "../@types/context";

export function AppContextProvider({ children }: ChildrenProps) {
  const [appContext, setAppContext] = useState<ContextType>({
    user: null,
    runner: "Autoscroll",
  });

  return <AppContext.Provider value={{ appContext, setAppContext }}>{children}</AppContext.Provider>;
}
