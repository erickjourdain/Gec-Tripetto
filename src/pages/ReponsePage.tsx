import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Export, Instance } from "@tripetto/runner";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormulaire } from "./IndexForm";
import VersionReponse from "../components/VersionsReponse";
import ChampsReponse from "../components/ChampsReponse";
import TableReponse from "../components/TableReponse";
import PlayTripetto from "../components/PlayTripetto";
import { AnswerAPI } from "../@types/answerAPI";
import { AnwserUpdate } from "../@types/answerUpdate";
import { getAnswers, updateAnswer } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { formatDateTime } from "../utils/format";

interface ReturnValues {
  statut: string;
  demande: number | null;
  opportunite: number | null;
}

const ReponsePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // récupération du paramètre de la page: identifiant de la série de réponses
  const { uuid } = useParams();

  // récupération du formulaire via le contexte de la route
  const { form } = useFormulaire();

  // Etat du composant
  const [version, setVersion] = useState<string>(location.state.version);
  const [versions, setVersions] = useState<string[]>([]);
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);
  const [reponses, setReponses] = useState<string[]>([]);
  const [updatedReponse, setUpdatedReponse] = useState<AnswerAPI | null>(null);
  const [badData, setBadData] = useState<boolean>(false);
  const [tobeUpated, setTobeUpated] = useState<boolean>(false);
  const [modification, setModification] = useState<boolean>(false);

  // query récupération des réponses
  const queryAnswers = useQuery({
    queryKey: ["getAnswers", uuid, version],
    queryFn: () => {
      if (uuid === undefined || version === "") return null;
      const filters = sfAnd([sfEqual("uuid", uuid), sfEqual("version", version)]);
      return getAnswers(`filter=${filters}&size=1`);
    },
  });
  const queryVersions = useQuery({
    queryKey: ["getAnswers", uuid],
    queryFn: () => {
      if (uuid === undefined) return;
      const include = ["version"];
      const filters = sfEqual("uuid", uuid);
      return getAnswers(`filter=${filters}&include=${include.join(",")}&size=50`);
    },
  });

  // gestion des changements d'états
  useEffect(() => {
    if (queryAnswers.data) {
      setReponse(queryAnswers.data.data.data[0]);
      setReponses([queryAnswers.data.data.data[0].reponse]);
      setUpdatedReponse(null);
    }
  }, [queryAnswers]);
  useEffect(() => {
    if (queryVersions.data) {
      setVersions(queryVersions.data.data.data.map((res: { version: string }) => res.version));
    }
  }, [queryVersions]);
  /*
  useEffect(() => {
    if (!isEqual(reponse, updatedReponse) && reponse && updatedReponse) {
      setTobeUpated(true);
      setReponses([reponse.reponse, updatedReponse.reponse]);
    }
  }, [updatedReponse]);
  */
  // mise à jour des données suite modification utilisateur
  const handleChange = (values: ReturnValues, err: boolean) => {
    if (values.demande !== reponse?.demande || values.opportunite !== reponse?.opportunite || values.statut !== reponse?.statut) {
      console.log("mise à jour");
      if (updatedReponse) {
        console.log("avec updated");
        setUpdatedReponse({
          ...updatedReponse,
          ...values,
        });
      }
      else if (reponse) {
        console.log("avec reponse");
        console.log(values);
        console.log(err);
        setUpdatedReponse({
          ...reponse,
          ...values,
        });
      }
      setBadData(err);
    }
  };

  const handleTrippetoChange = (instance: Instance) => {
    const exportables = Export.exportables(instance);
    if (updatedReponse) {
      setUpdatedReponse({
        ...updatedReponse,
        reponse: JSON.stringify(exportables),
      });
    } else if (reponse) {
      setUpdatedReponse({
        ...reponse,
        reponse: JSON.stringify(exportables),
      });
    }
    setModification(false);
    return true;
  };

  // définition mutation hook pour mise à jour des données
  const {
    error: putError,
    isError: isPutError,
    mutate,
  } = useMutation({
    mutationFn: updateAnswer,
    onSuccess: () => navigate(-1),
  });

  // lancement mise à jour des données
  const onSubmit = () => {
    if (reponse && updatedReponse) {
      const payload: AnwserUpdate = { id: reponse.id };
      if (reponse.statut !== updatedReponse.statut) payload.statut = updatedReponse.statut;
      if (reponse.demande !== updatedReponse.demande) payload.demande = updatedReponse.demande;
      if (reponse.opportunite !== updatedReponse.opportunite) payload.opportunite = updatedReponse.opportunite;
      if (reponse.reponse !== updatedReponse.reponse) payload.reponse = updatedReponse.reponse;
      mutate(payload);
    }
  };

  // affichage loading
  if (queryAnswers.isLoading || queryVersions.isLoading)
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );

  // affichage erreur en cas d'erreur de la requête de chargement des données
  if (queryAnswers.isError || queryVersions.isError || isPutError)
    return (
      <Alert variant="filled" severity="error">
        {manageError(queryAnswers.error || queryVersions.error || putError)}
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
        Initié le {formatDateTime(reponse?.createdAt)} par {reponse?.createur.prenom} {reponse?.createur.nom}
      </Typography>
      {versions.length > 0 && version && <VersionReponse versions={versions} initialVersion={version} onVersionChange={(ver: string) => setVersion(ver)} />}
      {reponse && <ChampsReponse reponse={reponse} onUpdate={handleChange} />}
      {!modification && (
        <Box display="flex" justifyContent="flex-end">
          <Button
            disabled={!reponse?.courante}
            variant="contained"
            color="secondary"
            onClick={() => {
              setModification(true);
            }}
          >
            Modifier réponse
          </Button>
        </Box>
      )}
      {reponse && !modification && form && <TableReponse form={form} reponses={reponses} />}
      {reponse && modification && form !== null && form.formulaire !== null && form.formulaire !== undefined && (
        <div style={{ width: "100%" }}>
          <PlayTripetto form={form.formulaire} data={JSON.parse(reponse.reponse)} onSubmit={handleTrippetoChange} />
        </div>
      )}
      {!modification && (
        <Box mt={3}>
          <Stack spacing={2} direction="row">
            <Button disabled={!tobeUpated || badData} variant="contained" color="primary" onClick={() => onSubmit()}>
              Mettre à jour
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default ReponsePage;
