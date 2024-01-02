import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Role, User } from "../../@types/user";
import { updateUser } from "../../utils/apiCall";

type IFormInputs = {
  prenom: string;
  nom: string;
  login: string;
  role: Role;
  valide: boolean;
  bloque: boolean;
};

type UpdateFormProps = {
  user: User;
  onError: (error: Error) => void;
  onSaved: () => void
};

const UpdateForm = ({ user, onError, onSaved }: UpdateFormProps) => {
  const roles = ["ADMIN", "CREATOR", "CONTRIBUTOR", "USER", "READER"];

  // Définition des éléments pour la validation du formulaire
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<IFormInputs>({
    defaultValues: {
      prenom: user.nom,
      nom: user.prenom,
      login: user.login,
      role: user.role,
      bloque: user.bloque,
      valide: user.valide,
    },
  });

  useEffect(() => {
    reset({
      prenom: user.nom,
      nom: user.prenom,
      login: user.login,
      role: user.role,
      bloque: user.bloque,
      valide: user.valide,
    });
  }, [user]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: onSaved,
    onError: (error: Error) => onError(error),
  });

  const onSubmit = (data: IFormInputs) => {
    mutate({
      ...data,
      id: user.id,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        sx={{ mt: 2, "& .MuiTextField-root": { flex: "0 0 30%", m: 1 }, "& .MuiFormControlLabel-root": { flex: "0 0 30%", m: 1 } }}
      >
        <TextField
          id="nom"
          label="nom"
          {...register("nom", {
            required: "Le nom est obligatoire",
          })}
          error={errors.nom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.nom?.message}
        </Typography>
        <TextField
          id="prenom"
          label="prenom"
          {...register("prenom", {
            required: "Le prenom est obligatoire",
          })}
          error={errors.prenom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.prenom?.message}
        </Typography>
        <TextField
          id="login"
          label="login"
          {...register("login", {
            required: "Le login est obligatoire",
          })}
          error={errors.login ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.login?.message}
        </Typography>
        <Box sx={{ width: "30%" }}>
          <FormControl fullWidth>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel id="role-select-label">role</InputLabel>
                  <Select id="role-select" labelId="role-select-label" label="role" {...field}>
                    {roles.map((r) => (
                      <MenuItem value={r} key={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
          </FormControl>
        </Box>
        <Controller
          name="valide"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label="validé" />
          )}
        />
        <Controller
          name="bloque"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label="bloqué" />
          )}
        />
      </Box>
      <Box mt={3} display="flex" alignItems="flex-start">
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary" disabled={isPending} type="submit">
            {!isPending ? "Mettre à jour" : "Loading..."}
          </Button>
          <Button variant="contained" color="warning" disabled={isPending} onClick={() => reset()}>
            Reset
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UpdateForm;
