import { isEmpty } from "lodash";
import { useState } from "react";
import { useOutletContext, useParams } from "react-router";
import { useSubmit } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAppContext } from "../utils/appContext";
import { Form } from "../@types/form";
import { Context } from "../@types/context";
import ChatTripetto from "../components/ChatTripetto";
import FormInputs from "../components/FormInputs";

const EditForm = () => {
  // définition du type pour la mise à jour des données
  type UpdateFormValues = {
    id?: number;
    titre?: string;
    description?: string | null;
    formulaire?: string | null;
    createur?: number;
  };

  // définition du type pour la gestion de l'état local
  type State = {
    updateFormulaire: boolean;
    testFormulaire: boolean;
    formulaire: string;
    error: string | null;
  };

  // récupération du contexte de l'application
  const { user } = useAppContext() as Context;
  // récupération du formulaire à mettre à jour via le contexte de la route
  const form = useOutletContext() as Form;

  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [state, setState] = useState<State>({
    updateFormulaire: false,
    testFormulaire: false,
    formulaire: "",
    error: null,
  });
  const submit = useSubmit();
  const params = useParams();

  // Lancement de l'appel à la requête de mise à jour lors de la validation du formulaire
  const onSubmit = (data: { titre: string; description: string | null | undefined; formulaire: string | null | undefined }) => {
    // définition des champs à mettre à jour
    const value: UpdateFormValues = {};
    if (data.titre.trim() !== form.titre.trim()) value.titre = data.titre;
    switch (data.description) {
      case undefined:
      case null:
        if (form.description !== null) value.description = null;
        break;
      default:
        const description = data.description.trim();
        if (description !== form.description?.trim()) {
          if (!isEmpty(description)) value.description = data.description;
          else value.description = null;
        }
        break;
    }
    if (state.updateFormulaire) {
      value.formulaire = data.formulaire;
      value.createur = user?.id;
    }
    if (!isEmpty(value)) {
      value.id = form.id;
      submit(value, {
        method: "PATCH",
        action: `/formulaire/${params.slug}/edit`,
        encType: "application/json",
      });
    } else {
      setState({
        ...state,
        error: "aucune donnée n'a été modifiée",
      });
      setTimeout(() => {
        setState({
          ...state,
          error: null,
        });
      }, 2500);
    }
  };

  return (
    <>
      <Paper>
        <Box px={3} py={2}>
          <Typography variant="h6" align="center" margin="dense">
            Mise à jour du formulaire: <b>{form.titre}</b>
          </Typography>
          <FormInputs form={
            {
              titre: form.titre,
              description: form.description,
              formulaire: JSON.stringify(form.formulaire)
            }}
            onSubmit={onSubmit}
            onUpdateFormulaire={(val: boolean) => {
              setState({
                ...state,
                updateFormulaire: val
              })
            }}
            onTestFormulaire={(val: string) => {
              setState({
                ...state,
                testFormulaire: true,
                formulaire: val,
              });
            }}
          />
        </Box>
      </Paper>
      {state.testFormulaire && <ChatTripetto form={JSON.parse(state.formulaire)} />}
    </>
  );
};

export default EditForm;
