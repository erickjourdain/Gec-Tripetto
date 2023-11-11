import { useEffect, useState } from "react";
import { sfEqual } from "spring-filter-query-builder";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { capitalize, isEmpty, isEqual, xorWith } from "lodash";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FormAnswers } from "../@types/formAnswers";
import { getAnswers } from "../utils/apiCall";
import { formTripettoAnswers, formatDateTime } from "../utils/format";
import manageError from "../utils/manageError";
import ResultsTable from "../components/ResultsTable";
import PlayTripetto from "../components/PlayTripetto";
import { Typography } from "@mui/material";
import { Export, Import, Instance } from "@tripetto/runner";
import { AnswerAPI } from "../@types/answerAPI";

/**
 * Page de présentation d'un résultat
 * @returns JSX
 */
const ReponsePage = () => {
  type Workflow = "visualisation" | "modification" | "modifie";

  const { uuid } = useParams();

  // State: réponses
  const [reponses, setReponses] = useState<AnswerAPI[]>([]);
  // State: sélection
  const [selected, setSelected] = useState<number | null>(null);
  // State: réponses formatées
  const [formattedReponses, setFormattedReponses] = useState<FormAnswers[]>([]);
  // State: avancement
  const [workflow, setWorkflow] = useState<Workflow>("visualisation");

  // query de récupération des réponses
  const {
    isLoading,
    data: axiosData,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAnswer"],
    queryFn: () => {
      if (uuid === undefined) return;
      const query = sfEqual("uuid", uuid);
      return getAnswers(`${query}&sortBy=desc(createdAt)`);
    },
    staleTime: Infinity,
  });

  // gestion des changements d'états
  useEffect(() => {
    if (!axiosData) return setFormattedReponses([]);
    setReponses(axiosData.data.data);
  }, [axiosData]);

  useEffect(() => {
    if (reponses && reponses.length) {
      const data = formTripettoAnswers(JSON.parse(reponses[0].formulaire.formulaire), JSON.parse(reponses[0].reponse))
      setFormattedReponses(data);
      setSelected(0);
    } else {
      setFormattedReponses([]);
      setSelected(null);
    }
  }, [reponses])

  // modification des réponses
  const isModified = (data: Import.IFieldByKey[]): Boolean => {
    if (selected === null) return false;
    const oldData: Import.IFieldByKey[] = [];
    JSON.parse(reponses[selected].reponse).fields.forEach((field: Export.IExportableField) => {
      oldData.push({
        key: field.key,
        value: field.value,
      });
    });
    return isEmpty(xorWith(data, oldData, isEqual));
  };

  // fonction de traitement des données fournies en réponse au formulaire
  const onSubmit = (instance: Instance) => {
    if (selected === null) return true;
    // récupération des réponses fournies au questionnaire
    const exportables = Export.exportables(instance);
    const values: Import.IFieldByKey[] = [];
    exportables.fields.forEach((field) => {
      values.push({
        key: field.key,
        value: field.value,
      });
    });
    const modified = isModified(values);
    const form = reponses[selected].formulaire.formulaire;
    const data = formTripettoAnswers(JSON.parse(form), exportables);
    setFormattedReponses(data);
    setWorkflow(modified ? "visualisation" : "modifie");
    return true;
  };

  // affichage loading
  if (isLoading)
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );

  // affichage erreur en cas d'erreur de chargement des formulaires
  if (isError)
    return (
      <Alert variant="filled" severity="error">
        {manageError(error)}
      </Alert>
    );

  // affichage de la réponse sélectionnée
  if (selected !== null)
    return (
      <Paper
        sx={{
          marginTop: "10px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ pl: 3 }}>
          Qualification {capitalize(reponses[selected].formulaire.titre)}
        </Typography>
        <Box
          component="div"
          sx={{
            "&": { display: "flex", flexWrap: "wrap", p: 3 },
            "& .MuiTextField-root": { flex: "0 0 30%", m: 1 },
          }}
        >
          <TextField
            id="createur"
            label="Createur"
            defaultValue={`${reponses[selected].createur.prenom} ${reponses[selected].createur.nom}`}
            disabled
          />
          <TextField id="createdAt" label="Date creation" defaultValue={formatDateTime(reponses[selected].createdAt)} disabled />
          <TextField id="updateddAt" label="Date mise à jour" defaultValue={formatDateTime(reponses[selected].updatedAt)} disabled />
          <TextField id="statut" label="Statut" defaultValue={reponses[selected].statut} disabled />
          <TextField
            id="demande"
            label="Demande"
            defaultValue={reponses[selected].demande ? `DEM${reponses[selected].demande}` : "Aucune"}
            disabled
          />
          <TextField
            id="opportunite"
            label="Opportunite"
            defaultValue={reponses[selected].opportunite ? `OPP${reponses[selected].opportunite}` : "Aucune"}
            disabled
          />
          {(workflow === "visualisation" || workflow === "modifie") && <ResultsTable reponses={formattedReponses} />}
          {workflow === "visualisation" && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setWorkflow("modification");
              }}
            >
              Modifier
            </Button>
          )}
          {workflow === "modifie" && (
            <Stack direction="row" spacing={2} sx={{ paddingBottom: "10px" }}>
              <Button color="primary" variant="contained" onClick={() => console.log("enregistrement")}>
                Enregistrer
              </Button>
              <Button color="secondary" variant="contained" onClick={() => console.log("annulation")}>
                Annuler
              </Button>
            </Stack>
          )}
          {workflow === "modification" && reponses[selected] && reponses[selected].formulaire.formulaire && (
            <div style={{ width: "100%" }}>
              <PlayTripetto
                form={JSON.parse(reponses[selected].formulaire.formulaire)}
                data={JSON.parse(reponses[selected].reponse)}
                onSubmit={onSubmit}
              />
            </div>
          )}
        </Box>
      </Paper>
    );
};

export default ReponsePage;
