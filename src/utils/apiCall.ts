import axios, { AxiosRequestConfig, AxiosError} from "axios";
import { sfAnd, sfEqual, sfLike } from "spring-filter-query-builder";
import { FormCreation } from "../@types/formCreation";

// Création de l'instance Axios pour les requêtes vers l'API
const instance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
});

/**
 * Lancement d'une requête vers l'API
 *    le payload est un objet json contenant:
 *      - la méthode "GET", "POST", "PATCH", "DELETE"
 *      - l'url correspondant à la route
 *      - un objet "data" pour les métodes "POST" et "PATCH"
 * @param {Object} payload
 * @returns Promise retournant la réponse ou un Object JSON avec l'erreur
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiRequest = async (payload: AxiosRequestConfig): Promise<any> => {
  try {
    const response = await instance.request(payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response!;
    } else {
      throw new Error('Erreur serveur');
    }
  }
}

/**
 * Mise à jour du Header de l'instance pour les futures requêtes
 * avec le token fourni par l'API
 * @param {String} token
 */
const setAuthorisation = (token: string) => {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Suppresion du token dans le Header des futures requêtes
 */
const delAuthorisation = () => {
  instance.defaults.headers.common['Authorization'] = '';
}

/**
 * Lancement requête de récupération des formulaires
 * @param titre chaine de caractères à rechercher dans le titre du formulaire null par défaut
 * @param page numéro de la page première page par défaut
 * @returns Promise retournant une réponse de type AxiosResponse
 */
const getForms = (titre: string | null = null, page= 1) => {
  // construction du chemin d'interrogation de l'API
  const searchParams = titre ? sfAnd([sfEqual("valide", "true"), sfLike("titre", `*${titre}*`)]) : sfEqual("valide", "true");
  const include = ["id", "titre", "slug"];
  // lancement de la requête
  return instance.request({
    method: "GET",
    url: `/data/forms?filter=${searchParams}&page=${page}&include=${include.join(",")}`,
  });
}

const getForm = (slug: string | undefined) => {
  return instance.request({
    method: "GET",
    url: `data/forms/slug/${slug}`,
  });
}

const createForm = (payload: FormCreation) => {
  return instance.request({
    method: "POST",
    url: "/data/forms",
    data: payload,
  })
}

const updateForm = (payload: {
  id?: number,
  titre?: string,
  description?: string | null,
  formulaire?: string,
  createur?: number,
}) => {
  return instance.request({
    method: "PATCH",
    url: `/data/forms/${payload.id}`,
    data: payload,
  });
}

const login = (payload: { login: string, password: string }) => {
  return instance.request({
    method: "POST",
    url: "/auth/authenticated",
    data: payload,
  });
}

const getCurrentUser = () => {
  return instance.request({
    method: "GET",
    url: "/data/users/me"
  });
};

export {
  apiRequest,
  setAuthorisation,
  delAuthorisation,
  login,
  getCurrentUser,
  getForms,
  getForm,
  createForm,
  updateForm
};

