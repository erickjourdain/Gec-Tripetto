import { Params, redirect } from "react-router-dom";
import { sfAnd, sfEqual, sfLike } from "spring-filter-query-builder";

import { apiRequest, delAuthorisation, setAuthorisation } from "./apiCall";
import { User } from "../@types/user";
import { SetUserType } from "../@types/context";

import { Form } from "../@types/form";
import { FormsResponse } from "../@types/formsReponse";
import { FormResponse } from "../@types/formResponse";

/**
 * Loader de la home page
 * Connexion à l'API pour récupération des données de l'utilisateur à partir du token enregistré dans le navigateur
 * Récupération des formulaires à présenter
 * @param {User} user - l'utlisateur enregistré dans le contexte de l'application
 * @param {Function} setUser - fonction de mise à jour de l'utilisateur enregistré dans le contexte de l'application
 * @returns
 */
const rootLoader =
  (user: User | null, setUser: SetUserType) =>
  async ({ request }: { request: Request }) => {
    // l'utilisateur n'est pas connecté
    if (!user) {
      // récupération du token stocké dans le navigateur
      const token = localStorage.getItem("token");
      // le token existe
      if (token) {
        try {
          // connexion de l'utilisateur à l'API pour récupération de ses droits d'accès
          setAuthorisation(token);
          const user: User = await apiRequest({
            method: "GET",
            url: "/data/users/me",
          });
          setUser(user);
        } catch (error) {
          localStorage.removeItem("token");
          delAuthorisation();
          return redirect("/login");
        }
      } else {
        // aucun token stocké redirection vers la page de login
        return redirect("/login");
      }
    }
    // récupération du filtre sur les données
    const url = new URL(request.url);
    const titre = url.searchParams.get("titre");
    const page = url.searchParams.get("page");
    // construction du chemin d'interrogation de l'API
    const searchParams = titre ? sfAnd([sfEqual("valide", "true"), sfLike("titre", `*${titre}*`)]) : sfEqual("valide", "true");
    // éxécution de la requête de récupération des formulaires à proposer
    const forms: FormsResponse = await apiRequest({
      method: "GET",
      url: `/data/forms?filter=${searchParams}&page=${page || 1}`,
    });
    return forms;
  };

const formLoader = async ({ params }: { params: Params<string> }): Promise<Form | null> => {
  const form: FormResponse = await apiRequest({
    method: "GET",
    url: `data/forms/slug/${params.slug}`,
  });
  return {
    ...form,
    formulaire: form.formulaire ? JSON.parse(form.formulaire) : null,
  };
};

export { formLoader, rootLoader };
