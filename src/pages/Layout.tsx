import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Menu from "../components/Menu";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../utils/appContext";
import { Context } from "../@types/context";
import { getCurrentUser } from "../utils/apiCall";
import { Typography } from "@mui/material";

const drawerWidth: number = 240;
const defaultTheme = createTheme();

const MainBox = styled(Box, {})(() => ({
  "&": {
    display: "flex",
  },
  "& .loading": {
    opacity: "0.25",
    transition: "opacity 200ms",
    transitionDelay: "200ms",
  }
}))

const Layout = () => {
  // Chargement des données du Contexte de l'application
  const { user, setUser } = useAppContext() as Context;

  // Création état local pour affichage du menu latéral
  const [open, setOpen] = useState(true);

  // Chargement de l'utilisateur courant
  const {
    isLoading,
    data: userData,
    isError,
    isSuccess
  } = useQuery({
    queryKey: ["getCurrentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  // Enregistrement des données utilisateurs dans le contexte de l'application
  useEffect(() => {
    if (isSuccess) {
      setUser(userData.data);
    }
  }, [userData]);

  // Gestion de la mise à jour de l'état d'affichage du menu latéral
  const handleToogleDrawer = () => {
    setOpen(!open);
  };

  // Erreur lors du chargement de l'utilisateur retour vers la page de login
  if (isError) return <Navigate to="/login" />;

  if (!isLoading)
    return (
      <ThemeProvider theme={defaultTheme}>
        <MainBox className={isLoading ? "loading" : ""}>
          <CssBaseline />
          <Menu open={open} drawerwidth={drawerWidth} onToggleDrawer={handleToogleDrawer} />
          <Sidebar open={open} drawerwidth={drawerWidth} onToggleDrawer={handleToogleDrawer} />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Outlet />
            </Container>
          </Box>
        </MainBox>
      </ThemeProvider>
    );
  else return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <Typography variant="h5">Chargement en cours....</Typography>
      <CircularProgress />
    </Box>
  );
};

export default Layout;
