import { DateTime } from "luxon";
import { useState } from "react";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import red from "@mui/material/colors/red";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import EditForm from "./EditForm";
import { useFormulaire } from "./IndexForm";

const Header = styled(
  CardHeader,
  {},
)(() => ({
  "& .MuiCardHeader-title": {
    fontWeight: 500,
    fontSize: "1rem",
  },
}));

// Définition du type pour l'état local du composant
type Status = {
  edit: boolean;
};

/**
 * Composant de présentation du formulaire
 * @returns JSX
 */
const InfoForm = () => {
  // récupération du formulaire via le contexte de la route
  const { form } = useFormulaire();

  const [status, setStatus] = useState<Status>({
    edit: false,
  });

  const convertDate = (date: string | undefined) => {
    return date ? DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED) : "";
  };

  const handleFinish = () => {
    setStatus({
      ...status,
      edit: false,
    });
  };

  if (form)
    return (
      <>
        <Box display="flex" justifyContent="center">
          <Card sx={{ minWidth: 350, maxWidth: 500 }}>
            <Header
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="createur">
                  {form.createur?.prenom
                    .charAt(0)
                    .toLocaleUpperCase()
                    .concat(form.createur?.nom.charAt(0).toLocaleUpperCase())}
                </Avatar>
              }
              action={
                <IconButton
                  aria-label="settings"
                  onClick={() => {
                    setStatus({ ...status, edit: !status.edit });
                  }}
                >
                  <EditIcon />
                </IconButton>
              }
              title={form.titre?.toUpperCase()}
              subheader={`v${form.version} du ${convertDate(form.createdAt)}`}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {form.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="lancer formulaire">
                <SmartDisplayIcon />
              </IconButton>
              <IconButton aria-label="voir résultats">
                <FindInPageIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Box>
        {status.edit && <EditForm onFinish={handleFinish} />}
      </>
    );
  else return (
    <Alert severity="warning">
      <AlertTitle>Impossible de charger le formulaire demandé!</AlertTitle>
    </Alert>
  );
};

export default InfoForm;
