import { isEmpty } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { updateForm } from "../utils/apiCall";
import PlayTripetto from "./PlayTripetto";
import FormInputs from "./FormInputs";
import manageError from "../utils/manageError";
import { useFormulaire } from "../pages/IndexForm";

// définition du type pour la mise à jour des données
type UpdateFormValues = {
  id?: number;
  titre?: string;
  description?: string | null;
  formulaire?: string;
};

// définition du type pour la gestion de l'état local
type State = {
  updateFormulaire: boolean;
  testFormulaire: boolean;
  formulaire: string;
  error: string | null;
};

//const EditForm = ({ onFinish }: EditFormProps) => {
const EditForm = () => {
  const navigate = useNavigate();

  // récupération du formulaire à mettre à jour via le contexte de la route
  const { form, setForm } = useFormulaire();

  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [state, setState] = useState<State>({
    updateFormulaire: false,
    testFormulaire: false,
    formulaire: "",
    error: null,
  });

  // définition de la requête de mise à jour du formulaire
  const { mutate } = useMutation({
    mutationFn: updateForm,
    onSuccess: (response) => {
      if (form && form.slug !== response.data.slug) {
        navigate(`/formulaire/${response.data.slug}`);
      } else {
        setForm({
          ...response.data,
          formulaire: response.data ? JSON.parse(response.data.formulaire) : {},
        });
        navigate({ pathname: "../" });
      }
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
    if (form) {
      // définition des champs à mettre à jour
      const value: UpdateFormValues = {};
      if (data.titre.trim() !== form.titre?.trim()) value.titre = data.titre;
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
      }
      if (!isEmpty(value)) {
        value.id = form.id;
        mutate(value);
      } else {
        navigate({ pathname: "../" });
      }
    }
  };

  if (form)
    return (
      <>
        <Paper
          sx={{
            marginTop: "10px",
          }}
        >
          <Box px={3} py={2}>
            <FormInputs
              form={{
                titre: form.titre,
                description: form.description,
                formulaire: JSON.stringify(form.formulaire),
              }}
              onSubmit={onSubmit}
              onFinish={() => navigate({ pathname: "../" }) }
              onUpdateFormulaire={(val: boolean) => {
                setState({
                  ...state,
                  updateFormulaire: val,
                });
              }}
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

export default EditForm;
