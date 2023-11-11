import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import { getForm } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { Form } from "../@types/form";
import CardForm from "../components/CardForm";

type ContextType = {
  form: Form | null;
  setForm: React.Dispatch<React.SetStateAction<Form | null>>;
};

/**
 * Composant de base d'un formulaire
 *
 * @returns JSX
 */
const IndexForm = () => {
  const [form, setForm] = useState<Form | null>(null);
  const [customError, setCustomError] = useState<Error | null>(null);

  const { slug } = useParams();
  const navigate = useNavigate();

  // query de récupération du formulaire
  const {
    isLoading,
    data: formData,
    isError,
    error,
  } = useQuery({
    queryKey: ["getForm", slug],
    queryFn: () => getForm(slug),
  });

  // mise à jour des données suite modification des données du formulaire
  useEffect(() => {
    if (formData)
      switch (formData.data.nombreFormulaires) {
        case 0:
          setCustomError(new Error("Aucun formulaire trouvé"));
          break;
        case 1:
          setForm({
            ...formData.data.data[0],
            formulaire: JSON.parse(formData.data.data[0].formulaire),
          });
          break;
        default:
          setForm(null);
          break;
      }
    else setForm(null);
  }, [formData]);

  if (isLoading) return <div className="loading">Chargement des données...</div>;

  if (isError || customError)
    return (
      <Alert severity="warning">
        <AlertTitle>Impossible de charger le formulaire demandé!</AlertTitle>
        {manageError(error || customError)}
      </Alert>
    );

  if (form)
    return (
      <div>
        <CardForm form={form} onAction={(statut: string) => navigate({ pathname: statut})} />
        {formData && <Outlet context={{ form, setForm } satisfies ContextType} />}
      </div>
    );
};

export default IndexForm;

export function useFormulaire() {
  return useOutletContext<ContextType>();
}
