import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Export, Instance } from "@tripetto/runner";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { AnswerAPI } from "../@types/answerAPI";
import { AnwserUpdate } from "../@types/answerUpdate";
import { formatDateTime } from "../utils/format";
import { updateAnswer } from "../utils/apiCall";
import manageError from "../utils/manageError";
import TableReponse from "./TableReponse";
import { useFormulaire } from "../pages/IndexForm";
import PlayTripetto from "./PlayTripetto";

interface Version {
  id: number;
  version: number;
  courante: boolean;
}

interface ReponseFormProps {
  answer: AnswerAPI | null;
  versions: Version[];
  onVersionChange: (ver: number) => void;
}

interface IFormInputs {
  version: "" | (() => number) | undefined;
  gestionnaire: string;
  createdAt: string;
  updatedAt: string;
  statut: string;
  reponse: string;
  demande: number | null;
  opportunite: number | null;
}

const ReponseForm = ({ answer, versions, onVersionChange }: ReponseFormProps) => {
  const statuts = ["BROUILLON", "QUALIFICATION", "DEVIS", "GAGNE", "PERDU"];

  const navigate = useNavigate();
  // récupération du formulaire via le contexte de la route
  const { form } = useFormulaire();

  // définition état du component
  const [reponses, setReponses] = useState<string[]>([]);
  const [modification, setModification] = useState<boolean>(false);

  // définition du hook pour la gestion du formulaire
  const {
    control,
    formState: { errors, isValid },
    getValues,
    register,
    reset,
    setValue,
    watch,
  } = useForm<IFormInputs>({
    mode: "all",
    defaultValues: {
      version: () => versions.find((ver) => ver.courante)?.version || 1,
      statut: "",
    },
  });

  const version = watch("version");

  // définition mutation hook pour mise à jour des données
  const { error, isError, mutate } = useMutation({
    mutationFn: updateAnswer,
    onSuccess: () => navigate(-1),
  });

  useEffect(() => {
    if (answer) {
      setValue("gestionnaire", `${answer.gestionnaire.prenom} ${answer.gestionnaire.nom}`);
      setValue("createdAt", formatDateTime(answer.createdAt));
      setValue("updatedAt", formatDateTime(answer.updatedAt));
      setValue("statut", answer.statut);
      setValue("demande", answer.demande);
      setValue("opportunite", answer.opportunite);
      setReponses([answer.reponse]);
    }
  }, [answer]);
  useEffect(() => {
    if (typeof version === "number") onVersionChange(version);
  }, [version]);

  // mise à jour suite validation formualire Tripetto
  const handleTrippetoChange = (instance: Instance) => {
    if (form && answer) {
      const exportables = Export.exportables(instance);
      setValue("reponse", JSON.stringify(exportables));
      setReponses([reponses[0], JSON.stringify(exportables)]);
      setModification(false);
    }
    return true;
  };

  // reset des données du formulaire
  const handleReset = () => {
    if (answer) setReponses([answer.reponse]);
    reset();
  };

  // annulation de l'action
  const handleFinish = () => {
    navigate(-1);
  };

  // mise à jour des données
  const handleSubmit = () => {
    if (answer) {
      const payload: AnwserUpdate = { id: answer.id };
      if (answer.statut !== getValues("statut")) payload.statut = getValues("statut");
      if (answer.demande !== getValues("demande")) payload.demande = getValues("demande");
      if (answer.opportunite !== getValues("opportunite")) payload.demande = getValues("opportunite");
      if (answer.reponse !== getValues("reponse")) payload.reponse = getValues("reponse");
      mutate(payload);
    }
  };

  if (isError)
    return (
      <Alert variant="filled" severity="error">
        {manageError(error)}
      </Alert>
    );

  if (!answer) return <></>;
  else {
    return (
      <>
        <Box display="flex" justifyContent="flex-end" sx={{ mr: 1 }}>
          <FormControl sx={{ minWidth: 100 }} size="small">
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel id="version-select-label">Version</InputLabel>
                  <Select id="version-select" labelId="version-select-label" label="version" {...field}>
                    {versions.map((ver) => (
                      <MenuItem value={ver.version} key={ver.id}>
                        {ver.version}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
          </FormControl>
        </Box>
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
                    <Select id="statut-select" labelId="statut-select-label" label="statut" {...field}>
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
            disabled={!answer.courante}
            {...register("demande", { pattern: { value: /^[0-9]{6,6}$/g, message: "La demande doit comporter 6 chiffres" } })}
            error={errors.demande ? true : false}
          />
          <TextField
            id="opportunite"
            label="Opportunité"
            InputProps={{
              startAdornment: <InputAdornment position="start">OPP</InputAdornment>,
            }}
            disabled={!answer.courante}
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
        <Box display="flex" justifyContent="flex-end">
          <Button
            disabled={!answer?.courante || modification}
            variant="contained"
            color="secondary"
            onClick={() => {
              setModification(true);
            }}
          >
            Modifier réponse
          </Button>
        </Box>
        {form && !modification && <TableReponse form={form} reponses={reponses} />}
        {form && form.formulaire && modification && (
          <div style={{ width: "100%" }}>
            <PlayTripetto form={form.formulaire} data={JSON.parse(answer.reponse)} onSubmit={handleTrippetoChange} />
          </div>
        )}{" "}
        <Box mt={3}>
          <Stack spacing={2} direction="row">
            <Button variant="contained" color="primary" disabled={!isValid} onClick={handleSubmit}>
              Mettre à jour
            </Button>
            <Button variant="contained" color="warning" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="contained" color="secondary" onClick={handleFinish}>
              Annuler
            </Button>
          </Stack>
        </Box>
      </>
    );
  }
};

export default ReponseForm;
