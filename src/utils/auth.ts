import { Context } from "../@types/context";
import { useAppContext } from "./appContext";

const isAdmin = () => {
  const { appContext } = useAppContext() as Context;
  return appContext.user?.role === "ADMIN";
}

const isContributeur = () => {
  const { appContext } = useAppContext() as Context;
  return appContext.user?.role === "ADMIN" || appContext.user?.role === "CONTRIBUTEUR";
}

const isLogged = () => {
  const { appContext } = useAppContext() as Context;
  return !appContext.user
}

export {
  isAdmin,
  isContributeur,
  isLogged,
}
