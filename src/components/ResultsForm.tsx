import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useFormulaire } from "../pages/IndexForm";
import manageError from "../utils/manageError";
import { getAnswers } from "../utils/apiCall";
import { formatDateTime } from "../utils/format";
import { User } from "../@types/user";
import { AnswerAPI } from "../@types/answerAPI";
import SearchUser from "./SearchUser";

/**
 * Composant de présentation des résultats d'un formulaire
 * @returns JSX
 */
const ResultsForm = () => {
  const navigate = useNavigate();
  // récupération du formulaire via le contexte de la route
  const { form } = useFormulaire();

  const [user, setUser] = useState<User | null>(null);

  // query de récupération des réponses au formulaire
  const {
    isLoading,
    data: reponses,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAnswersTable", user],
    queryFn: () => {
      let query = user
        ? sfAnd([sfEqual("courante", "true"), sfEqual("formulaire", form?.id || 0), sfEqual("createur", user.id)])
        : sfAnd([sfEqual("courante", "true"), sfEqual("formulaire", form?.id || 0)]);
      return getAnswers(`filter=${query.toString()}&page=1`);
    },
    refetchOnWindowFocus: false,
  });

  // mise à jour de l'utilisateur sélectionné
  const onUserChange = (newUser: User | null) => {
    setUser(newUser);
  };

  // affichage loading
  if (isLoading)
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );

  // affichage erreur en cas d'erreur de chargement des formulaires
  if (isError)
    return (
      <Alert variant="filled" severity="error">
        {manageError(error)}
      </Alert>
    );

  return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box sx={{ minWidth: 400, maxWidth: "80%", margin: "auto" }}>
        <SearchUser onUserChange={onUserChange} />
        <Table aria-label="table-resultats">
          <TableHead>
            <TableRow>
              <TableCell>Voir</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Demande</TableCell>
              <TableCell>Opportunite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reponses &&
              reponses.data.data.map((reponse: AnswerAPI) => (
                <TableRow key={reponse.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>
                    <VisibilityIcon sx={{ cursor: "pointer" }} onClick={() => navigate({ pathname: `${reponse.uuid}/${reponse.version}` })} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {reponse.createur.nom} {reponse.createur.prenom}
                  </TableCell>
                  <TableCell>{formatDateTime(reponse.createdAt)}</TableCell>
                  <TableCell>{reponse.version}</TableCell>
                  <TableCell>{reponse.statut}</TableCell>
                  <TableCell>{reponse.demande ? `DEM${reponse.demande}` : ""}</TableCell>
                  <TableCell>{reponse.opportunite ? `OPP${reponse.opportunite}` : ""}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default ResultsForm;
