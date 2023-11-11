import { Context } from "../@types/context";
import { useAppContext } from "./appContext";

const isAdmin = () => {
  const { appContext } = useAppContext() as Context;
  return appContext.user?.role === "ADMIN";
}

const isLogged = () => {
  const { appContext } = useAppContext() as Context;
  return !appContext.user
}

export {
  isAdmin,
  isLogged
}
