import { ChangeEvent, FormEvent, useState } from "react";
import { useSubmit } from "react-router-dom";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const submit = useSubmit();

  // Etat local pour gestion du formulaire de connexion
  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  // Gestion des mise à jour des champs du formulaire
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
  };

  // Appel de la requête de connexion à l'API
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(form, {
      method: "post",
      action: "/login",
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="login"
            type="text"
            name="login"
            value={form.login}
            onChange={handleChange}
            autoFocus
          />{" "}
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <p>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          </p>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
