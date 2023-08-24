import { Navigate, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import { Context } from "./@types/context";
import { useAppContext } from "./utils/appContext";
import { formLoader, rootLoader } from "./utils/loader";
import { addFormAction, editFormAction, loginAction } from "./utils/action";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import IndexForm from "./pages/IndexForm";
import AddForm from "./pages/AddForm";
import PlayForm from "./pages/PlayForm";
import EditForm from "./pages/EditForm";
import Error from "./components/Error";

function App() {
  // Chargement des données du Contexte de l'application
  const { user, setUser } = useAppContext() as Context;

  // Création des routes de l'application
  const router = createBrowserRouter([
    {
      path: "/",
      element: user !== null ? <Layout /> : <Navigate to="/" />,
      loader: rootLoader(user, setUser),
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: "ajouter",
          element: <AddForm />,
          action: addFormAction,
          errorElement: <Error />,
        },
        {
          path: "formulaire/:slug",
          loader: formLoader,
          element: <IndexForm />,
          children: [
            {
              index: true,
              element: <PlayForm />,
            },
            {
              path: "edit",
              element: <EditForm />,
              action: editFormAction,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      action: loginAction(setUser),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
