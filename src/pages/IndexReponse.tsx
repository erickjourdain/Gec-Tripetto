import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { Context } from "../@types/context";
import { AnswerAPI } from "../@types/answerAPI";
import { useAppContext } from "../utils/appContext";
import { getUniqueAnswer, unlockAnswer } from "../utils/apiCall";
import Createur from "../components/reponses/Createur";
import Versions from "../components/reponses/Versions";
import UpdateForm from "../components/reponses/UpdateForm";
import ErrorAlert from "../components/ErrorAlert";
import ExportExcel from "../components/reponses/ExportExcel";

const IndexReponse = () => {
  // Chargement des données du Contexte de l'application
  const { appContext } = useAppContext() as Context;
  const navigate = useNavigate();
  const { slug, uuid, version } = useParams();
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);
  const [locked, setLocked] = useState<boolean>(true);

  const handleVersionChange = (ver: string) => {
    if (reponse && reponse.utilisateur?.id === appContext.user?.id) unlock(reponse.id);
    navigate(`/formulaire/${slug}/answers/${uuid}/${ver}`);
  };

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

  const { mutate: unlock } = useMutation({
    mutationFn: unlockAnswer,
  });

  // mise à jour de l'état du composant
  useEffect(() => {
    if (data && isSuccess) {
      setReponse(data.data);
      setLocked(data.data.lockedAt && data.data.utilisateur.id !== appContext.user?.id);
    }
  }, [data]);
  useEffect(() => {
    return () => {
      if (reponse && reponse.utilisateur?.id === appContext.user?.id) unlock(reponse.id);
    };
  }, [reponse]);

  const handleUpdated = (ver: number) => {
    if (ver.toString() !== version) handleVersionChange(ver.toString());
    else refetch();
  };

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

  if (isError) return <ErrorAlert error={error} />;

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
        {reponse.courante && reponse.utilisateur !== null && reponse.utilisateur?.id !== appContext.user?.id && (
          <Alert severity="info">{`${reponse.utilisateur?.prenom} ${reponse.utilisateur?.nom} a verouillé la réponse`}</Alert>
        )}
        <UpdateForm courante={reponse.courante} locked={locked} answer={reponse} onUpdated={(ver: number) => handleUpdated(ver)} />
      </Paper>
    );
  }
};

export default IndexReponse;
