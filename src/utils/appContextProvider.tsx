import { useState } from "react";

import { AppContext } from "./appContext";
import { ChildrenProps } from "../@types/childrenProps";
import { User } from "../@types/user";

export function AppContextProvider({ children }: ChildrenProps) {
  const [user, setUser] = useState<User|null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}