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
import ErrorAlert from "../components/ErrorAlert";
import ExportExcel from "../components/reponses/ExportExcel";
import QuitConfirmDialog from "../components/QuitConfirmDialog";

const IndexReponse = () => {
  // Chargement des données du Contexte de l'application
  const { appContext } = useAppContext() as Context;
  const navigate = useNavigate();
  const { slug, uuid, version } = useParams();
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);
  const [locked, setLocked] = useState<boolean>(true);
  const [isDirty, setDirty] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const stateRef = useRef<AnswerAPI | null>(null);

  /**
   * Changement de la version de la réponse
   * @param ver string - version de la réponse
   */
  const handleVersionChange = (ver: string) => {
    navigate(`/formulaire/${slug}/answers/${uuid}/${ver}`);
  };

  const handleTouched = (isDirty: boolean) => {
    setDirty(isDirty);
  }

  const blocker = useBlocker(() => {
    if (isDirty) {
      setShowDialog(true);
      return true;
    } else {
      removeLock();
      return false;
    }
  })

  /**
   * Suppression de l'éventuel verrou
   */
  const removeLock = () => {
    if (reponse && reponse.lock && reponse.lock.utilisateur.id === appContext.user?.id) unlock(reponse.id);
  }

  /**
   * Fermeture du composant
   *    - suppresion d'éventuel verrou
   *    - vérification de l'enregistrement
   */
  const unMountComponent = (val: boolean) => {
    setShowDialog(false);
    if (val) {
      removeLock();
      if (blocker.state === "blocked") blocker.proceed();
    } else blocker.state === "unblocked";
  }

  // query de récupération de la réponse à afficher
  const { error, data, isError, isLoading, isSuccess, refetch } = useQuery({
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
    };
  }, []);

  /**
   * Gestion du changement de version lors de la mise à jour des données
   * @param ver string - version de la réponse
   */
  const handleUpdated = (ver: number) => {
    if (ver.toString() !== version) handleVersionChange(ver.toString());
    else refetch();
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

  // Affichage de l'erreur
  if (isError) return <ErrorAlert error={error} />;

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
        <UpdateForm courante={reponse.courante} locked={locked} answer={reponse} onUpdated={(ver: number) => handleUpdated(ver)} onTouched={handleTouched}/>
        <QuitConfirmDialog show={showDialog} confirmQuit={unMountComponent} />
      </Paper>
    );
  }
};

export default IndexReponse;
