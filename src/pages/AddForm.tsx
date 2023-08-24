import { isEmpty } from "lodash";
import { useState } from "react";
import { useSubmit } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Context } from "../@types/context";
import { useAppContext } from "../utils/appContext";
import FormInputs from "../components/FormInputs";
import ChatTripetto from "../components/ChatTripetto";

const AddForm = () => {
  // définition du type pour la création du formulaire
  type FormValue = {
    titre: string;
    description: string | null;
    formulaire: string | null;
    createur: number;
  };

  // définition du type pour la gestion de l'état local
  type State = {
    testFormulaire: boolean;
    formulaire: string;
    error: string | null;
  };

  // récupération du contexte de l'application
  const { user } = useAppContext() as Context;

  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [state, setState] = useState<State>({
    testFormulaire: false,
    formulaire: "",
    error: null,
  });

  const submit = useSubmit();

  // Lancement de l'appel à la requête de mise à jour lors de la validation du formulaire
  const onSubmit = (data: { titre: string; description: string | null; formulaire: string }) => {
    if (!user) return;
    const value: FormValue = {
      titre: data.titre,
      description: data.description && !isEmpty(data.description.trim())
        ? data.description.trim() : null,
      formulaire: data.formulaire,
      createur: user.id,
    };
    submit(value, {
      method: "POST",
      action: "/ajouter",
      encType: "application/json",
    });
  };

  return (
    <>
      <Paper>
        <Box px={3} py={2}>
          <Typography variant="h6" align="center" margin="dense">
            Création d'un nouveau formulaire de qualification
          </Typography>
          <FormInputs
            form={{
              titre: "",
              description: "",
              formulaire: "",
            }}
            onSubmit={onSubmit}
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

export default AddForm;
