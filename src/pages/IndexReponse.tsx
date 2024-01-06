import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useBlocker } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { AnswerAPI, Context } from "gec-tripetto";
import { useAppContext } from "../utils/appContext";
import { getUniqueAnswer, unlockAnswer } from "../utils/apiCall";
import Createur from "../components/reponses/Createur";
import Versions from "../components/reponses/Versions";
import UpdateForm from "../components/reponses/UpdateForm";
import ExportExcel from "../components/reponses/ExportExcel";
import manageError from "../utils/manageError";

const IndexReponse = () => {
  // Chargement des données du Contexte de l'application
  const { appContext, setAppContext } = useAppContext() as Context;

  const navigate = useNavigate();
  const { slug, uuid, version } = useParams();
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);
  const [locked, setLocked] = useState<boolean>(true);

  const stateRef = useRef<AnswerAPI | null>(null);

  /**
   * Changement de la version de la réponse
   * @param ver string - version de la réponse
   */
  const handleVersionChange = (ver: string) => {
    navigate(`/formulaire/${slug}/answers/${uuid}/${ver}`);
  };

  // query de récupération de la réponse à afficher
  const { error, data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getAnswersUpdateForm", uuid, version],
    queryFn: () => {
      if (uuid === undefined || version === undefined) return Promise.resolve(null);
      const filters = sfAnd([sfEqual("uuid", uuid), sfEqual("version", version)]);
      return getUniqueAnswer(`filter=${filters}&include=id`);
    },
    refetchOnWindowFocus: false,
  });

  // query de dévérouillage d'une réponse
  const { mutate: unlock } = useMutation({
    mutationFn: unlockAnswer,
  });

  // mise à jour de l'état du composant
  useEffect(() => {
    if (data && isSuccess) {
      const rep = data.data as AnswerAPI;
      setReponse(rep);
      setLocked(rep.lock && rep.lock.utilisateur.id !== appContext.user?.id);
      stateRef.current = rep;
    }
  }, [data]);
  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAppContext({ ...appContext, alerte: { severite: "error", message: manageError(error) } });
  }, [isError]);
  // gestion de la fermeture de la fenêtre et du déchargement du composant
  useEffect(() => {
    const handleTabClose = (() => {
      if (stateRef.current && stateRef.current.lock && stateRef.current.lock.utilisateur.id === appContext.user?.id) {
        unlockAnswer(stateRef.current.id);
      }
    });

    // ajout d'un listener sur le démontage du composant et fermeture de l'onglet
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      if (stateRef.current && stateRef.current.lock && stateRef.current.lock.utilisateur.id === appContext.user?.id) {
        unlock(stateRef.current.id);
      }
    };
  }, []);

  /**
   * Mise à jour de la réponse
   * @param updatedAnswer AnswerAPI - réponse mise à jour
   */
  const handleUpdated = (updatedAnswer: AnswerAPI) => {
    if (updatedAnswer.version.toString() !== version) handleVersionChange(updatedAnswer.version.toString());
    else {
      setReponse(updatedAnswer);
      setLocked(updatedAnswer.lock && updatedAnswer.lock.utilisateur.id !== appContext.user?.id);
      stateRef.current = updatedAnswer;
    };
  };

  // Affichage lors du chargement des données
  if (isLoading)
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );

  // Affichage du composant
  if (isSuccess && reponse && version) {
    return (
      <Paper
        sx={{
          marginTop: "10px",
          p: 3,
        }}
      >
        <Createur />
        <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mb: 1 }}>
          <Versions version={version} onVersionChange={handleVersionChange} />
          <ExportExcel />
        </Box>
        {reponse.courante && reponse.lock !== null && reponse.lock.utilisateur.id !== appContext.user?.id && (
          <Alert severity="warning">{`${reponse.lock.utilisateur.prenom} ${reponse.lock.utilisateur.nom} a verouillé la réponse`}</Alert>
        )}
        <UpdateForm courante={reponse.courante} locked={locked} answer={reponse} onUpdated={handleUpdated} />
      </Paper>
    );
  }
};

export default IndexReponse;
