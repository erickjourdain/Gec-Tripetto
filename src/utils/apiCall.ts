import axios, { AxiosRequestConfig, AxiosError} from "axios";

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
      const { data } = error.response!;
      throw new Error(data);
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

export { apiRequest, setAuthorisation, delAuthorisation };

