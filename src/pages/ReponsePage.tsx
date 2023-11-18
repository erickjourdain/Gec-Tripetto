import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sfEqual } from "spring-filter-query-builder";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { AnswerAPI } from "../@types/answerAPI";
import { getAnswer, getAnswers } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { formatDateTime } from "../utils/format";
import ReponseForm from "../components/ReponseForm";

interface Version {
  id: number;
  version: number;
  courante: boolean;
}

const ReponsePage = () => {

  // récupération du paramètre de la page: identifiant de la série de réponses
  const { uuid } = useParams();

  // états du formulaire
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [answer, setAnswer] = useState<AnswerAPI | null>(null);

  // query récupération des versions existantes de la réponse
  const queryVersions = useQuery({
    queryKey: ["getAnswers", uuid],
    queryFn: () => {
      if (uuid === undefined) return Promise.resolve(null);
      const include = ["id", "version", "courante"];
      const filters = sfEqual("uuid", uuid);
      return getAnswers(`filter=${filters}&include=${include.join(",")}&size=50`);
    },
    refetchOnWindowFocus: false,
  });
  const queryAnswer = useQuery({
    queryKey: ["getAnswer", currentVersion],
    queryFn: () => {
      if (!currentVersion) return Promise.resolve(null);
      return getAnswer(currentVersion, null);
    },
    refetchOnWindowFocus: false,
  });

  const handleVersionChange = (ver: number) => setCurrentVersion(ver);

  // gestion des changements des états de la page
  useEffect(() => {
    if (queryVersions.data) {
      const data = queryVersions.data.data.data as Version[];
      setVersions(data);
      const version = data.filter((ver) => ver.courante);
      if (version) setCurrentVersion(version[0].id);
    }
  }, [queryVersions]);
  useEffect(() => {
    if (queryAnswer.data) {
      const data = queryAnswer.data.data as AnswerAPI;
      setAnswer(data);
    }
  }, [queryAnswer]);

  // affichage loading
  if (queryAnswer.isLoading || queryVersions.isLoading)
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );

  // affichage erreur en cas d'erreur de la requête de chargement des données
  if (queryAnswer.isError || queryVersions.isError)
    return (
      <Alert variant="filled" severity="error">
        {manageError(queryAnswer.error || queryVersions.error)}
      </Alert>
    );

  return (
    <Paper
      sx={{
        marginTop: "10px",
        p: 3,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ pl: 3 }}>
        Initié le {formatDateTime(answer?.createdAt)} par {answer?.createur.prenom} {answer?.createur.nom}
      </Typography>
      <ReponseForm answer={answer} versions={versions} onVersionChange={handleVersionChange} />
    </Paper>
  );
};

export default ReponsePage;
