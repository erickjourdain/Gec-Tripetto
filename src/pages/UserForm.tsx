import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sfEqual } from "spring-filter-query-builder";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Context, User } from "gec-tripetto";
import { getUsers } from "../utils/apiCall";
import { useAppContext } from "../utils/appContext";
import manageError from "../utils/manageError";
import UpdateForm from "../components/users/UpdateForm";

const UserForm = () => {
  // Chargement des données du Contexte de l'application
  const { appContext } = useAppContext() as Context;
  // Récupération des données de la route
  const { slug } = useParams();

  // Définition des variables d'état du composant
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const { data, isLoading } = useQuery({
    queryKey: ["user", slug],
    queryFn: () => {
      const filter = `filter=${sfEqual("slug", slug ? slug : "")}`;
      return getUsers(filter, [], 1, 1);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      if (data?.data.data.length !== 1) setError(new Error("Erreur lors du chargement de l'utilisateur"));
      if (appContext.user?.role === "ADMIN" || data?.data.data[0].id !== appContext.user?.id) {
        const us = data?.data.data[0] as User;
        setUser(us);
      } else setError(new Error("Vous ne disposez pas des droits pour accéder à cette page"));
    }
  }, [data]);

  const handleSaved = () => {
    setSaved(true);
    setTimeout(function () {
      setSaved(false);
    }, 5000);
  };

  if (error) return <Alert severity="error">{manageError(error)}</Alert>;

  if (isLoading)
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );

  if (user)
    return (
      <Paper
        sx={{
          marginTop: "10px",
        }}
      >
        <Box px={3} py={2}>
          <Typography variant="h6" margin="dense">
            Profil {user.prenom} {user.nom}
          </Typography>
          {saved && <Alert severity="success">Les données ont été mises à jour</Alert>}
          <UpdateForm user={user} onError={(error: Error) => setError(error)} onSaved={handleSaved} />
        </Box>
      </Paper>
    );
};

export default UserForm;
