import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { login, setAuthorisation } from "../utils/apiCall";
import manageError from "../utils/manageError";

// Définition du type pour l'état local du composant
type Status = {
  error: null | string;
  isLoading: boolean;
  isConnected: boolean;
};

/**
 * Page de Login
 *
 * @returns JSX
 */
const Login = () => {
  // Etat local pour gestion de l'état des requêts de connexion
  const [status, setStatus] = useState<Status>({
    error: null,
    isLoading: false,
    isConnected: false,
  });

  // Définition des éléments pour la validation du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  // Requête de login pour récupération du token de session
  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // sauvegarde du token dans le navigateur
      localStorage.setItem("token", response.data.token);
      // intégration du token dans le Header des futures requêtes
      setAuthorisation(response.data.token);
      setStatus({
        isConnected: true,
        isLoading: false,
        error: null,
      });
    },
    onError: (error) => {
      setStatus({
        isConnected: false,
        isLoading: false,
        error: manageError(error),
      });
      setError("root", { type: "serveur", message: manageError(error) });
    },
  });

  // Appel de la requête de connexion à l'API
  const onSubmit = async (data: { login: string, password: string }) => {
    mutate({ login: data.login, password: data.password });
  };

  // Naviguer vers Home page si utilisateur connecté
  if (status.isConnected) return <Navigate to="/" />;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="login"
            {...register("login", {
              required: "Le Login est obligatoire.",
            })}
            error={errors.login ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.login?.message}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="password"
            type="password"
            {...register("password", {
              required: "Le mot de passe est obligatoire.",
            })}
            error={errors.password ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.password?.message}
          </Typography>
          <Typography variant="inherit" color="error">
            {errors.root?.message}
          </Typography>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={status.isLoading}>
            {!status.isLoading ? "Login" : "Loading ..."}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
