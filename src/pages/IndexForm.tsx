import { useEffect, useState } from "react";
import { Outlet, useOutletContext, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import { getForm } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { Form } from "../@types/form";

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

  const { slug } = useParams();

  // query de récupération des formulaires
  const {
    isLoading,
    data: formData,
    isError,
    error
  } = useQuery({
    queryKey: ["getForm", slug],
    queryFn: () => getForm(slug),
  });

  useEffect(() => {
    setForm({
      ...formData?.data,
      formulaire: formData?.data.formulaire ? JSON.parse(formData?.data.formulaire) : {},
    });
  }, [formData])

  return (
    <div className={isLoading ? "loading" : ""}>
      {isError && (
        <Alert severity="warning">
          <AlertTitle>Impossible de charger le formulaire demandé!</AlertTitle>
          {manageError(error)}
        </Alert>
      )}
      {formData && <Outlet context={{form, setForm} satisfies ContextType} />}
    </div>
  );
};

export default IndexForm;

export function useFormulaire() {
  return useOutletContext<ContextType>();
}
