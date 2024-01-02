import { Context } from "gec-tripetto";
import { useAppContext } from "./appContext";

const isAdmin = () => {
  const { appContext } = useAppContext() as Context;
  return appContext.user?.role === "ADMIN";
}

const isCreator = () => {
  const { appContext } = useAppContext() as Context;
  return appContext.user?.role === "ADMIN" || appContext.user?.role === "CREATOR";
}

const isContributor = () => {
  const { appContext } = useAppContext() as Context;
  return appContext.user?.role === "ADMIN" || appContext.user?.role === "CREATOR" || appContext.user?.role === "CONTRIBUTOR";
};

const isLogged = () => {
  const { appContext } = useAppContext() as Context;
  return !appContext.user
}

export { isAdmin, isCreator, isContributor, isLogged };
