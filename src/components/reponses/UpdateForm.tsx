import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Export, Instance } from "@tripetto/runner";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { AnswerAPI } from "../../@types/answerAPI";
import { AnwserUpdate } from "../../@types/answerUpdate";
import { updateAnswer } from "../../utils/apiCall";
import { formatDateTime } from "../../utils/format";
import { isContributor } from "../../utils/auth";
import TableReponse from "../TableReponse";
import PlayTripetto from "../PlayTripetto";

interface IFormInputs {
  gestionnaire: string;
  createdAt: string;
  updatedAt: string;
  statut: string;
  reponse: string;
  demande: number | null;
  opportunite: number | null;
  version: number;
}

interface UpdateFormProps {
  courante: boolean;
  locked: boolean;
  answer: AnswerAPI;
  onUpdated: (version: number) => void;
}

const UpdateForm = ({ courante, locked, answer, onUpdated }: UpdateFormProps) => {
  const statuts = ["BROUILLON", "QUALIFICATION", "DEVIS", "GAGNE", "PERDU", "TERMINE"];

  const [reponses, setReponses] = useState<string[]>([]);
  const [mutation, setMutation] = useState<boolean>(false);
  const [dialog, setDialog] = useState<boolean>(false);

  // query de mutation des données
  const { mutate } = useMutation({
    mutationFn: updateAnswer,
    onSuccess: (rep) => {
      setMutation(false);
      onUpdated(rep.data.version);
    },
  });

  // définition du hook pour la gestion du formulaire
  const {
    control,
    formState: { errors, isValid, isDirty },
    getValues,
    register,
    reset,
    setValue,
  } = useForm<IFormInputs>({
    mode: "all",
    defaultValues: {
      gestionnaire: `${answer.gestionnaire.prenom} ${answer.gestionnaire.nom}`,
      createdAt: formatDateTime(answer.createdAt),
      updatedAt: formatDateTime(answer.updatedAt),
      statut: answer.statut,
      demande: answer.demande,
      opportunite: answer.opportunite,
      reponse: answer.reponse,
    },
  });

  // reset du formulaire suite changement de version
  useEffect(() => {
    if (!isDirty || answer.version !== getValues("version")) {
      reset({
        gestionnaire: `${answer.gestionnaire.prenom} ${answer.gestionnaire.nom}`,
        createdAt: formatDateTime(answer.createdAt),
        updatedAt: formatDateTime(answer.updatedAt),
        statut: answer.statut,
        demande: answer.demande,
        opportunite: answer.opportunite,
        reponse: answer.reponse,
      });
    }
    setReponses([answer.reponse]);
  }, [answer]);

  // mise à jour suite validation formulaire Tripetto
  const handleTrippetoChange = (instance: Instance) => {
    const exportables = Export.exportables(instance);
    setValue("reponse", JSON.stringify(exportables));
    setDialog(false);
    setReponses([answer.reponse, JSON.stringify(exportables)]);
    return true;
  };

  // reset des données du formulaire
  const handleReset = () => {
    reset();
  };

  // mise à jour des données
  const handleSubmit = () => {
    if (answer) {
      setDialog(false);
      const payload: AnwserUpdate = { id: answer.id };
      if (answer.statut !== getValues("statut")) payload.statut = getValues("statut");
      if (answer.demande !== getValues("demande")) payload.demande = getValues("demande");
      if (answer.opportunite !== getValues("opportunite")) payload.demande = getValues("opportunite");
      if (answer.reponse !== getValues("reponse")) payload.reponse = getValues("reponse");
      setMutation(true);
      mutate(payload);
    }
  };

  // Modification des données du formulaire
  const isChanged = () => {
    if (
      answer.statut !== getValues("statut") ||
      answer.demande !== getValues("demande") ||
      answer.opportunite !== getValues("opportunite") ||
      answer.reponse !== getValues("reponse")
    )
      return true;
    else return false;
  };

  if (answer) {
    return (
      <>
        {!courante && (
          <Alert sx={{ mt: 1 }} severity="info">
            Cette version n'est pas la version courante
          </Alert>
        )}
        <Box display="flex" flexWrap="wrap" justifyContent="space-around" sx={{ mt: 2, "& .MuiTextField-root": { flex: "0 0 30%", m: 1 } }}>
          <TextField id="gestionnaire" label="Gestionnaire" disabled {...register("gestionnaire")} />
          <TextField id="createdAt" label="Date creation" disabled {...register("createdAt")} />
          <TextField id="updateddAt" label="Date mise à jour" disabled {...register("updatedAt")} />{" "}
          <Box sx={{ width: "30%", m: 1 }}>
            <FormControl fullWidth>
              <Controller
                name="statut"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel id="statut-select-label">Statut</InputLabel>
                    <Select
                      id="statut-select"
                      labelId="statut-select-label"
                      label="statut"
                      disabled={!courante || !isContributor() || locked}
                      {...field}
                    >
                      {statuts.map((st) => (
                        <MenuItem value={st} key={st}>
                          {st}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
            </FormControl>
          </Box>
          <TextField
            id="demande"
            label="Demande"
            InputProps={{
              startAdornment: <InputAdornment position="start">DEM</InputAdornment>,
            }}
            disabled={!courante || !isContributor() || locked}
            {...register("demande", { pattern: { value: /^[0-9]{6,6}$/g, message: "La demande doit comporter 6 chiffres" } })}
            error={errors.demande ? true : false}
          />
          <TextField
            id="opportunite"
            label="Opportunité"
            InputProps={{
              startAdornment: <InputAdornment position="start">OPP</InputAdornment>,
            }}
            disabled={!courante || !isContributor() || locked}
            {...register("opportunite", { pattern: { value: /^[0-9]{6,6}$/g, message: "L'opportunité doit comporter 6 chiffres" } })}
            error={errors.opportunite ? true : false}
          />
          <Typography variant="inherit" color="error" sx={{ width: "30%", m: 1 }}>
            {errors.statut?.message}
          </Typography>
          <Typography variant="inherit" color="error" sx={{ width: "30%", m: 1 }}>
            {errors.demande?.message}
          </Typography>
          <Typography variant="inherit" color="error" sx={{ width: "30%", m: 1 }}>
            {errors.opportunite?.message}
          </Typography>
        </Box>
        {(courante || isContributor()) && !locked && (
          <Box>
            <Button
              disabled={!answer?.courante || dialog}
              variant="outlined"
              color="secondary"
              endIcon={<ChangeCircleOutlinedIcon />}
              onClick={() => {
                setDialog(true);
              }}
            >
              Modifier réponse
            </Button>
          </Box>
        )}
        {!dialog && <TableReponse form={JSON.parse(answer.formulaire.formulaire)} reponses={reponses} />}
        <div style={{ width: "100%" }}>
          <PlayTripetto
            open={dialog}
            onClose={() => setDialog(false)}
            form={JSON.parse(answer.formulaire.formulaire)}
            data={JSON.parse(answer.reponse)}
            onSubmit={handleTrippetoChange}
          />
        </div>
        {(courante || isContributor()) && !locked && (
          <Box mt={3}>
            <Stack spacing={2} direction="row">
              <Button variant="contained" color="primary" disabled={!isValid || !isChanged() || mutation} onClick={handleSubmit}>
                {mutation ? "Sauvegare en cours" : "Mettre à jour"}
              </Button>
              <Button variant="contained" color="warning" onClick={handleReset}>
                Reset
              </Button>
            </Stack>
          </Box>
        )}
      </>
    );
  }
};

export default UpdateForm;
