import { Navigate, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import { Context } from "./@types/context";
import { useAppContext } from "./utils/appContext";
import { rootLoader } from "./utils/loader";
import { loginAction } from "./utils/action";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";

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
