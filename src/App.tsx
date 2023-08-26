import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Layout from "./pages/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import IndexForm from "./pages/IndexForm";
import AddForm from "./pages/AddForm";
import Error from "./components/Error";
import InfoForm from "./pages/InfoForm";
import { setAuthorisation } from "./utils/apiCall";

// création d'un instance de QueryClient
const queryClient = new QueryClient({});

function App() {
  // Chargement du token de connexion à l'API
  // récupération du token stocké dans le navigateur
  const token = localStorage.getItem("token");
  if (token) setAuthorisation(token);

  // Création des routes de l'application
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: "ajouter",
          element: <AddForm />,
          errorElement: <Error />,
        },
        {
          path: "formulaire/:slug",
          element: <IndexForm />,
          children: [
            {
              index: true,
              element: <InfoForm />,
            }
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
