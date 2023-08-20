import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Menu from "../components/Menu";
import Sidebar from "../components/Sidebar";
import { FormsResponse } from "../@types/formsReponse";

const drawerWidth: number = 240;

const defaultTheme = createTheme();

const Layout = () => {
  // Récupération de la liste des formualires à afficher dans le menu latéral
  const forms = useLoaderData() as FormsResponse;
  // Création état local pour affichage du menu latéral
  const [open, setOpen] = useState(true);

  // Gestion de la mise à jour de l'état d'affichage du menu latéral
  const handleToogleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Menu open={open} drawerwidth={drawerWidth} onToggleDrawer={handleToogleDrawer} />
        <Sidebar forms={forms} open={open} drawerwidth={drawerWidth} onToggleDrawer={handleToogleDrawer} />
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
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
