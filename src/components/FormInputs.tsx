import Ajv from "ajv";
import { SubmitHandler, useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import QuizIcon from "@mui/icons-material/Quiz";
import ClearIcon from "@mui/icons-material/Clear";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import TripettoSchema from "../@types/tripettoSchema.json";

type Props = {
  form: {
    titre: string;
    description: string | null;
    formulaire: string;
  };
  onSubmit: SubmitHandler<{
    titre: string;
    description: string | null;
    formulaire: string;
  }>;
  onUpdateFormulaire?: (val: boolean) => void;
  onTestFormulaire: (formulaire: string) => void;
};

const FormInputs = ({ form, onSubmit, onUpdateFormulaire, onTestFormulaire }: Props) => {
  // définition du type pour la gestion de l'état local
  type State = {
    updateFormulaire: boolean;
    testFormulaire: boolean;
    error: string | null;
  };

  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [state, setState] = useState<State>({
    updateFormulaire: false || (onUpdateFormulaire === undefined),
    testFormulaire: false,
    error: null,
  });

  // définition du texte du bouton de sauvegarde en fonction du contexte
  const btnSauvegarde = onUpdateFormulaire === undefined ? "Enregistrer" : "Mettre à jour";

  // validation du formulaire Tripetto
  const validateFormulaire = (value: string) => {
    try {
      const ajv = new Ajv({
        allowUnionTypes: true,
        validateSchema: false,
      });
      const validateForm = ajv.compile(TripettoSchema);
      validateForm(JSON.parse(value));
      if (validateForm.errors) throw new Error();
      return true;
    } catch (_err) {
      return "Le schema Tripetto est incorrect";
    }
  };

  // Gestion du changement d'état du switch pour la mise à jour des données du formulaire Tripetto
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [ev.target.name]: ev.target.checked,
    });
    if (onUpdateFormulaire) onUpdateFormulaire(ev.target.checked);
  };

  // Lancement du test du formulaire
  const handleTestFormulaire = () => {
    const formulaire = getValues("formulaire");
    const valideForm = validateFormulaire(formulaire);
    if (valideForm === true) onTestFormulaire(formulaire);
    else setState({
      ...state,
      error: valideForm,
    });
    setTimeout(() => {
      setState({
        ...state,
        error: null,
      })
    }, 2500);
  }

  // copier le presse papier dans le champ formulaire
  const handlePaste = () => {
    navigator.clipboard.readText()
      .then((text) => setValue("formulaire", text));
  }

  // enregistrement des composants de la forme pour utilisation par le Hook de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      titre: form.titre,
      description: form.description,
      formulaire: form.formulaire,
    },
  });

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="titre"
            label="Titre du formulaire"
            fullWidth
            margin="dense"
            {...register("titre", {
              required: "Le titre est obligatoire.",
              minLength: {
                value: 5,
                message: "Le titre doit contenir au moins 5 caractères.",
              },
              maxLength: {
                value: 155,
                message: "Le titre ne peut contenir plus de 155 caractères.",
              },
            })}
            error={errors.titre ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.titre?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="description"
            label="Description"
            multiline
            rows={3}
            fullWidth
            margin="dense"
            {...register("description", {
              minLength: {
                value: 5,
                message: "La description doit contenir au moins 25 caractères.",
              },
              maxLength: {
                value: 155,
                message: "La description ne peut contenir plus de 255 caractères.",
              },
            })}
            error={errors.description ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.description?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack spacing={2} direction="row">
            {onUpdateFormulaire && (
              <FormControlLabel
                control={<Switch checked={state.updateFormulaire} onChange={handleChange} name="updateFormulaire" />}
                label="MAJ Formulaire"
              />
            )}
            <Button variant="outlined" color="secondary" endIcon={<QuizIcon />} onClick={handleTestFormulaire}>
              Tester
            </Button>
            <Button variant="outlined" color="primary" endIcon={<ContentPasteGoIcon />} onClick={handlePaste}>
              Coller
            </Button>
            <Button
              variant="outlined"
              color="warning"
              endIcon={<ClearIcon />}
              disabled={!state.updateFormulaire}
              onClick={() => setValue("formulaire", "")}
            >
              Effacer
            </Button>
          </Stack>
          <TextField
            required
            id="formulaire"
            label="Formulaire Tripetto"
            multiline
            rows={5}
            fullWidth
            margin="dense"
            disabled={!state.updateFormulaire}
            {...register("formulaire", {
              required: "Le formulaire est obligatoire.",
              validate: validateFormulaire,
            })}
            error={errors.formulaire ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.formulaire?.message}
          </Typography>
        </Grid>
      </Grid>
      {state.error && <Alert severity="error">{state.error}</Alert>}
      <Box mt={3}>
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            {btnSauvegarde}
          </Button>
          <Button variant="contained" color="warning" onClick={() => reset()}>
            Reset
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default FormInputs;
