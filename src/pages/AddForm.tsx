import { isEmpty } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Context } from "../@types/context";
import { FormCreation } from "../@types/formCreation";
import { useAppContext } from "../utils/appContext";
import FormInputs from "../components/FormInputs";
import PlayTripetto from "../components/PlayTripetto";
import { createForm } from "../utils/apiCall";
import manageError from "../utils/manageError";

// définition du type pour la gestion de l'état local
type State = {
  testFormulaire: boolean;
  formulaire: string;
  error: string | null;
};

/**
 *
 * @returns
 */
const AddForm = () => {
  const navigate = useNavigate();

  // récupération du contexte de l'application
  const { appContext } = useAppContext() as Context;

  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [state, setState] = useState<State>({
    testFormulaire: false,
    formulaire: "",
    error: null,
  });

  // définition de la requête de création du formulaire
  const { mutate } = useMutation({
    mutationFn: createForm,
    onSuccess: (response) => {
      navigate(`/formulaire/${response.data.slug}`);
    },
    onError: (error) => {
      setState({
        ...state,
        error: manageError(error),
      });
    },
  });

  // Lancement de l'appel à la requête de mise à jour lors de la validation du formulaire
  const onSubmit = (data: { titre: string; description: string | null; formulaire: string }) => {
    const value: FormCreation = {
      titre: data.titre,
      description: data.description && !isEmpty(data.description.trim()) ? data.description.trim() : null,
      formulaire: data.formulaire,
      createur: appContext?.user?.id || -1,
    };
    mutate(value);
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
            error={state.error}
          />
        </Box>
      </Paper>
      {state.testFormulaire && (
        <PlayTripetto
          form={JSON.parse(state.formulaire)}
          onSubmit={() => {
            setState({ ...state, testFormulaire: false });
            return true;
          }}
        />
      )}
    </>
  );
};

export default AddForm;
