import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import red from "@mui/material/colors/red";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { Form } from "../@types/form";
import { formatDate } from "../utils/format";
import { isAdmin } from "../utils/auth";

const Header = styled(
  CardHeader,
  {},
)(() => ({
  "& .MuiCardHeader-title": {
    fontWeight: 500,
    fontSize: "1rem",
  },
}));

type CardFormProps = {
  form: Form;
  onAction?: (statut: string) => void;
};

const CardForm = ({ form, onAction }: CardFormProps) => {
  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ minWidth: 350, maxWidth: 500 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="createur">
              {form.createur?.prenom
                .charAt(0)
                .toLocaleUpperCase()
                .concat(form.createur?.nom.charAt(0).toLocaleUpperCase())}
            </Avatar>
          }
          action={
            isAdmin() &&
            onAction && (
              <IconButton aria-label="settings" onClick={() => onAction("edit")}>
                <EditIcon />
              </IconButton>
            )
          }
          title={form.titre?.toUpperCase()}
          subheader={`v${form.version} du ${formatDate(form.createdAt)}`}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {form.description}
          </Typography>
        </CardContent>
        {onAction && (
          <CardActions disableSpacing>
            <IconButton aria-label="lancer formulaire" onClick={() => onAction("play")}>
              <SmartDisplayIcon />
            </IconButton>
            <IconButton aria-label="voir résultats" onClick={() => onAction("answers")}>
              <FindInPageIcon />
            </IconButton>
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

export default CardForm;
