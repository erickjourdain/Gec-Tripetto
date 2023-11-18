import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { AnswerAPI } from "../@types/answerAPI";
import { getAnswers } from "../utils/apiCall";
import Createur from "../components/reponses/Createur";
import Versions from "../components/reponses/Versions";
import UpdateForm from "../components/reponses/UpdateForm";
import ErrorAlert from "../components/ErrorAlert";

const IndexReponse = () => {
  const navigate = useNavigate();
  const { slug, uuid, version } = useParams();
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);

  const handleVersionChange = (ver: string) => {
    navigate(`/formulaire/${slug}/answers/${uuid}/${ver}`);
  };

  // query de récupération de la réponse à afficher
  const { error, data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["getAnswersUpdateForm", uuid, version],
    queryFn: () => {
      if (uuid === undefined || version === undefined) return Promise.resolve(null);
      const filters = sfAnd([sfEqual("uuid", uuid), sfEqual("version", version)]);
      return getAnswers(`filter=${filters}`);
    },
    refetchOnWindowFocus: false,
  });

  // mise à jour de l'état du composant
  useEffect(() => {
    if (data && isSuccess) setReponse(data.data.data[0]);
  }, [data]);

  if (isLoading)
    return (
      <>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      </>
    );

  if (isError) return <ErrorAlert error={error} />;

  if (isSuccess && reponse && version)
    return (
      <Paper
        sx={{
          marginTop: "10px",
          p: 3,
        }}
      >
        <Createur />
        <Versions version={version} onVersionChange={handleVersionChange} />
        <UpdateForm courante={reponse.courante} answer={reponse} onUpdated={refetch}/>
      </Paper>
    );
};

export default IndexReponse;
