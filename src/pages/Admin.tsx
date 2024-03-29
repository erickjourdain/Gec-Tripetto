import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import { User } from "gec-tripetto";
import { displayAlert } from "../atomState";
import { getUsers } from "../utils/apiCall";
import manageError from "../utils/manageError";

const Admin = () => {
  const itemsPerPage = 5;

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);
  const navigate = useNavigate();

  // State: page du tableau
  const [page, setPage] = useState(0);
  // State: utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  // State: nombre utilisateurs
  const [nbUsers, setNbUsers] = useState<number>(0);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers(null, ["id", "prenom", "nom", "validated", "role", "locked", "slug"], page + 1, itemsPerPage),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setUsers(data?.data.data);
    setNbUsers(data?.data.nombreUsers);
  }, [data]);

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const icon = (val: boolean) => {
    return (val) ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
  }

  if (isLoading)
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );

  if (users)
    return (
      <Paper
        sx={{
          marginTop: "10px",
        }}
      >
        <Box sx={{ minWidth: 400, maxWidth: "80%", margin: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Gestion des utilisateurs
          </Typography>
          <Table aria-label="table-users">
            <TableHead>
              <TableRow>
                <TableCell>Voir</TableCell>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Validé</TableCell>
                <TableCell>Bloqué</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <VisibilityIcon sx={{ cursor: "pointer" }} onClick={() => navigate({ pathname: `user/${user.slug}` })} />
                  </TableCell>
                  <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{icon(user.validated)}</TableCell>
                  <TableCell>{icon(user.locked)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>{" "}
          <TablePagination
            rowsPerPageOptions={[itemsPerPage]}
            component="div"
            count={nbUsers}
            rowsPerPage={itemsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </Box>
      </Paper>
    );
};

export default Admin;
