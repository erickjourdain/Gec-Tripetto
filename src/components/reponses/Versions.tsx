import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sfEqual } from "spring-filter-query-builder";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getAnswers } from "../../utils/apiCall";
import ErrorAlert from "../../components/ErrorAlert";

interface Version {
  id: number;
  version: number;
  courante: boolean;
}

interface VersionsProps {
  version: string;
  onVersionChange: (ver: string) => void;
}

const Versions = ({ version, onVersionChange }: VersionsProps) => {
  // récupération du paramètre de la page: identifiant de la série de réponses
  const { uuid } = useParams();

  // états du formulaire
  const [versions, setVersions] = useState<Version[]>([]);

  // query récupération des versions existantes de la réponse
  const { data, error, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getAnswersVersion", uuid],
    queryFn: () => {
      if (uuid === undefined) return Promise.resolve(null);
      const include = ["id", "version", "courante"];
      const filters = sfEqual("uuid", uuid);
      return getAnswers(`filter=${filters}&include=${include.join(",")}&size=50`);
    },
    refetchOnWindowFocus: false,
  });

  // mise à jour du tableau des versions disponibles
  useEffect(() => {
    if (isSuccess && data) setVersions(data.data.data);
  }, [data]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="flex-end">
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    );

  if (isError) return <ErrorAlert error={error} />;

  if (isSuccess && versions.length > 0)
    return (
      <Box display="flex" justifyContent="flex-end">
        <FormControl sx={{ minWidth: 100 }} size="small">
          <InputLabel id="reponse-versions-select-label">Version</InputLabel>
          <Select
            labelId="reponse-versions-select-label"
            id="reponse-versions-select"
            value={version}
            label="Version"
            onChange={(evt: SelectChangeEvent) => {
              onVersionChange(evt.target.value);
            }}
          >
            {versions.map((ver) => (
              <MenuItem value={ver.id} key={ver.id}>
                {ver.version}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
};

export default Versions;
