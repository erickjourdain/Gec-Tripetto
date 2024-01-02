import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import { Answer, Form, FormAnswers } from "gec-tripetto";
import { formTripettoAnswers, formatDate } from "../utils/format";

type TableReponseProps = {
  form: Form;
  reponses: string[];
};

const TableReponse = ({ form, reponses }: TableReponseProps) => {
  const itemsPerPage = 10;

  // State: page du tableau des réponses
  const [page, setPage] = useState(0);
  const [formAnswers, setFormAnswers] = useState<FormAnswers[][]>([]);

  // Remise à jour des données suite changement des props
  useEffect(() => {
    setFormAnswers([]);
    const answers: FormAnswers[][] = [];
    for (let index = 0; index < reponses.length; index++) {
      answers.push(formTripettoAnswers(form, JSON.parse(reponses[index])));
    }
    setFormAnswers(answers);
  }, [reponses]);

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // mise en forme des réponses à afficher dans le tableau des résultats
  const reponseString = (values: Answer[]) => {
    if (values.length === 1) {
      let val: string = "";
      if (!values[0].value) return val;
      switch (values[0].dataType) {
        case "date":
          val = formatDate(values[0].value as number);
          break;
        default:
          val = values[0].value as string;
          break;
      }
      return val;
    } else {
      const data = values.map((val) => {
        if (val.value) return val.name;
        else return `<s>${val.name}</s>`;
      });
      return `${data.join(" - ")}`;
    }
  };

  return (
    <>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "50%" }}>Question</TableCell>
            <TableCell sx={formAnswers.length === 1 ? { width: "50%" } : { width: "25%" }}>Réponse</TableCell>
            {formAnswers.length > 1 && <TableCell sx={{ width: "25%" }}>Mise à jour</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {formAnswers.length > 0 &&
            (itemsPerPage > 0 ? formAnswers[0].slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage) : formAnswers[0]).map(
              (reponse, ind) => (
                <TableRow key={reponse.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {reponse.question ? reponse.question : reponse.reponses[0].name}
                  </TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: reponseString(reponse.reponses),
                      }}
                    />
                  </TableCell>
                  {formAnswers.length > 1 && (
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: reponseString(formAnswers[1][page * itemsPerPage + ind].reponses),
                        }}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ),
            )}
        </TableBody>
      </Table>
      {formAnswers.length > 0 && formAnswers[0].length > itemsPerPage && (
        <TablePagination
          rowsPerPageOptions={[itemsPerPage]}
          component="div"
          count={formAnswers[0].length}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
    </>
  );
};

export default TableReponse;
