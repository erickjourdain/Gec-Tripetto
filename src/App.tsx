import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAppContext } from "./utils/appContext";
import { setAuthorisation } from "./utils/apiCall";
import { Context } from "./@types/context";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import IndexForm from "./pages/IndexForm";
import AddForm from "./pages/AddForm";
import Error from "./components/Error";
import EditForm from "./components/EditForm";
import PlayForm from "./components/PlayForm";
import ResultsForm from "./components/ResultsForm";
import NotAllowed from "./components/NotAllowed";
import IndexReponse from "./pages/IndexReponse";
import SignIn from "./pages/SignIn";

// création d'un instance de QueryClient
const queryClient = new QueryClient({});

function App() {
  // Chargement des données du Contexte de l'application
  const { appContext } = useAppContext() as Context;
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
              path: "edit",
              element: appContext.user?.role === "ADMIN" ? <EditForm /> : <NotAllowed />,
            },
            {
              path: "play",
              element: <PlayForm open />,
            },
            {
              path: "answers",
              element: <ResultsForm />,
            },
            {
              path: "answers/:uuid/:version",
              element: <IndexReponse />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
