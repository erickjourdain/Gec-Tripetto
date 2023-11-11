import { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import EditForm from "../components/EditForm";
import PlayForm from "../components/PlayForm";
import ResultsForm from "../components/ResultsForm";
import CardForm from "../components/CardForm";
import { useFormulaire } from "./IndexForm";

/**
 * Composant de présentation du formulaire
 * @returns JSX
 */
const InfoForm = () => {
  // récupération du formulaire via le contexte de la route
  const { form } = useFormulaire();

  // définition du contexte du composant
  const [status, setStatus] = useState<string|null>(null);

  if (form)
    return (
      <>
        <CardForm form={form} onAction={(statut: string) => setStatus(statut)} />
        {status === "edit" && <EditForm />}
        {status === "play" && <PlayForm />}
        {status === "results" && <ResultsForm />}
      </>
    );
  else
    return (
      <Alert severity="warning">
        <AlertTitle>Impossible de charger le formulaire demandé!</AlertTitle>
      </Alert>
    );
};

export default InfoForm;
