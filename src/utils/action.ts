import { redirect } from "react-router-dom";
import { apiRequest, setAuthorisation } from "./apiCall";
import { SetUserType } from "../@types/context";

/**
 * Action de connection de l'utilisateur à l'application
 *    - Récupération du token d'authentification à l'API
 *    - Mise à jour des informations utilisateurs dans le contexte de l'application
 *
 * @param {Function} setUser
 * @returns redirection vers la home page
 */
const loginAction =
  (setUser: SetUserType) =>
  async ({ request }: { request: Request }) => {
    // récupération du login / mot de passe fournis via le formulaire
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);
    // requête de Login
    const { token } = await apiRequest({
      method: "POST",
      url: "/auth/authenticated",
      data: payload,
    });
    // sauvegarde du token dans le navigateur
    localStorage.setItem("token", token);
    // intégration du token dans le Header des futures requêtes
    setAuthorisation(token);
    // requête de récupération des données de l'utilisateur connecté
    const { data } = await apiRequest({
      method: "GET",
      url: "/data/users/me",
      data: token,
    });
    // mise àjour des informations dans le contexte de l'application
    setUser(data);
    // redirection vers la home page
    return redirect("/");
  };

/**
 * Action de mise à jour d'un formulaire
 * @param param0
 * @returns
 */
const editFormAction = async ({
  request
}: {
  request: Request;
}) => {
  // récupération des données à mettre à jour sous la forme d'un objet JSON
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // mise à jour des données
  const form = await apiRequest({
    method: "PATCH",
    url: `/data/forms/${formData.get("id")}`,
    data,
  });
  // redirection vers la page du formulaire mis à jour
  return redirect(`/formulaire/${form.slug}`);
};

const addFormAction = async ({
  request
}: {
  request: Request;
}) => {
  // récupération des données sous la forme d'un objet JSON
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // création du formulaire
  const form = await apiRequest({
    method: "POST",
    url: "/data/forms",
    data,
  });
  // redirection vers la page du formulaire nouvellement créé
  return redirect(`/formulaire/${form.slug}`);
};

export { addFormAction, editFormAction, loginAction };
