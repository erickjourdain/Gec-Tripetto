import { Export, Instance } from "@tripetto/runner";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useFormulaire } from "../pages/IndexForm";
import PlayTripetto from "./PlayTripetto";
import ResultsTable from "./ResultsTable";
import { saveAnswer } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { useAppContext } from "../utils/appContext";
import { formTripettoAnswers } from "../utils/format";
import { Context } from "../@types/context";
import { FormAnswers } from "../@types/formAnswers";
import { useNavigate } from "react-router";

type Workflow = "qualification" | "resultat" | "terminé";

const PlayForm = () => {
  const navigate = useNavigate();

  // récupération du contexte de l'application
  const { appContext } = useAppContext() as Context;
  // récupération du formulaire de qualification
  const { form } = useFormulaire();
  // State: avancement
  const [workflow, setWorkflow] = useState<Workflow>("qualification");
  // State: réponses
  const [reponses, setReponses] = useState<Export.IExportables | null>(null);
  // State: values
  //const [values, setValues] = useState<Export.IValues | null>(null);
  // State: réponses formatées
  const [formattedReponses, setFormattedReponses] = useState<FormAnswers[]>([]);
  // State: gestion des erreurs
  const [erreur, setErreur] = useState<String | null>(null);

  // fonction de traitement des données fournies en réponse au formulaire
  const onSubmit = (instance: Instance) => {
    // récupération des réponses fournies au questionnaire
    const exportables = Export.exportables(instance);
    //const values = Export.values(instance);
    //setValues(values);
    setReponses(exportables);
    const data = form ? formTripettoAnswers(form, exportables) : [];
    setFormattedReponses(data);
    setWorkflow("resultat");
    return true;
  };

  const { mutate } = useMutation({
    mutationFn: saveAnswer,
    onSuccess: () => navigate({ pathname: "../answers" }),
    onError: (error) => setErreur(manageError(error)),
  });

  const save = () => {
    mutate({
      reponse: JSON.stringify(reponses),
      formulaire: form ? form.id : 0,
    });
  };

  if (form && form.formulaire && workflow === "qualification") return <PlayTripetto form={form.formulaire} onSubmit={onSubmit} />;

  if (workflow === "resultat")
    return (
      <Paper
        sx={{
          marginTop: "10px",
        }}
      >
        <Box sx={{ minWidth: 400, maxWidth: "80%", margin: "auto" }}>
          <ResultsTable reponses={formattedReponses} />
          <Typography variant="inherit" color="error">
            {erreur}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ paddingBottom: "10px" }}>
            <Button variant="contained" color="primary" onClick={save}>
              Enregistrer
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate({ pathname: "../" })}>
              Annuler
            </Button>
          </Stack>
        </Box>
      </Paper>
    );
};

export default PlayForm;
