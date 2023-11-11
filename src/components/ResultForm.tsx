import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { getAnswer } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { formTripettoAnswers, formatDateTime } from "../utils/format";
import ResultsTable from "./ResultsTable";
import { FormAnswers } from "../@types/formAnswers";
import { useFormulaire } from "../pages/IndexForm";
import Button from "@mui/material/Button";
import PlayTripetto from "./PlayTripetto";

// définition du type pour les Props du composant
type ResultFormProps = {
  answer: number;
};

type Workflow = "termine" | "modification";

/**
 * Composant de présentation d'un résultat
 * @returns JSX
 */
const ResultForm = ({ answer }: ResultFormProps) => {
  // récupération du formulaire de qualification
  const { form } = useFormulaire();
  // State: avancement
  const [workflow, setWorkflow] = useState<Workflow>("termine");
  // State: réponses formatées
  const [formattedReponses, setFormattedReponses] = useState<FormAnswers[]>([]);

  // query de récupération de la réponse
  const {
    isLoading,
    data: reponse,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAnswer", answer],
    queryFn: () => getAnswer(answer.toString()),
  });

  useEffect(() => {
    const data = form && reponse ? formTripettoAnswers(form, JSON.parse(reponse?.data.reponse)) : [];
    setFormattedReponses(data);
  }, [reponse]);

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

  return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box
        component="div"
        sx={{
          "&": { display: "flex", flexWrap: "wrap", p: 3 },
          "& .MuiTextField-root": { flex: "0 0 30%", m: 1 },
        }}
      >
        <TextField id="createur" label="Createur" defaultValue={`${reponse.data.createur.prenom} ${reponse.data.createur.nom}`} disabled />
        <TextField id="createdAt" label="Date creation" defaultValue={formatDateTime(reponse.data.createdAt)} disabled />
        <TextField id="updateddAt" label="Date mise à jour" defaultValue={formatDateTime(reponse.data.updatedAt)} disabled />

        <TextField id="statut" label="Statut" defaultValue={reponse.data.statut} disabled />
        <TextField id="demande" label="Demande" defaultValue={reponse.data.demande ? `DEM${reponse.data.demande}` : "Aucune"} disabled />
        <TextField
          id="opportunite"
          label="Opportunite"
          defaultValue={reponse.data.opportunite ? `OPP${reponse.data.opportunite}` : "Aucune"}
          disabled
        />
        {workflow === "termine" && (
          <>
            <ResultsTable reponses={formattedReponses} />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setWorkflow("modification");
              }}
            >
              Modifier
            </Button>
          </>
        )}
        {workflow === "modification" && form && form?.formulaire && (
          <div style={{width: "100%"}}>
            <PlayTripetto form={form?.formulaire} data={JSON.parse(reponse.data.donnees)}/>
          </div>
        )}
      </Box>
    </Paper>
  );
};

export default ResultForm;
