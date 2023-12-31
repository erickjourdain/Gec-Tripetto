import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Export, Instance } from "@tripetto/runner";
import { useMutation } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Context, FormAnswers } from "gec-tripetto";
import { saveAnswer } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { formTripettoAnswers } from "../utils/format";
import { useAppContext } from "../utils/appContext";
import { useFormulaire } from "../pages/IndexForm";
import PlayTripetto from "./PlayTripetto";
import ResultsTable from "./ResultsTable";


type PlayFormProps = {
  open: boolean;
}

const PlayForm = ({ open }: PlayFormProps) => {
  const navigate = useNavigate();
  // Chargement des données du Contexte de l'application
  const { appContext, setAppContext } = useAppContext() as Context;

  // récupération du formulaire de qualification
  const { form } = useFormulaire();
  // State: réponses
  const [reponses, setReponses] = useState<Export.IExportables | null>(null);
  // State: réponses formatées
  const [formattedReponses, setFormattedReponses] = useState<FormAnswers[]>([]);
  // State: boite de dialogue formulaire
  const [dialog, setDialog] = useState(false);
  // State: avancement
  const [resultat, setResultat] = useState<boolean>(false);

  useEffect(() => {
    setDialog(open)
  }, [open]);

  // fonction de traitement des données fournies en réponse au formulaire
  const onSubmit = (instance: Instance) => {
    // fermeture de la boite de dialogue
    setDialog(false);
    // récupération des réponses fournies au questionnaire
    const exportables = Export.exportables(instance);
    //const values = Export.values(instance);
    //setValues(values);
    setReponses(exportables);
    const data = form ? formTripettoAnswers(form, exportables) : [];
    setFormattedReponses(data);
    setResultat(true);
    return true;
  };

  const { mutate } = useMutation({
    mutationFn: saveAnswer,
    onSuccess: () => {
      setAppContext({...appContext, alerte: { severite: "success", message: "Les données ont été sauvegardées" }});
      navigate({ pathname: "../answers" });
    },
    onError: (error: Error) => {
      setAppContext({...appContext, alerte: { severite: "danger", message: manageError(error) }});
    },
  });

  const save = () => {
    mutate({
      reponse: JSON.stringify(reponses),
      formulaire: form ? form.id : 0,
    });
  };

  if (form && form.formulaire)
    return (
      <>
        <PlayTripetto open={dialog} onClose={() => navigate(-1)} form={form.formulaire} onSubmit={onSubmit} />
        {resultat && (
          <Paper
            sx={{
              marginTop: "10px",
            }}
          >
            <Box sx={{ minWidth: 400, maxWidth: "80%", margin: "auto" }}>
              <ResultsTable reponses={formattedReponses} />
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
        )}
      </>
    );
};

export default PlayForm;
