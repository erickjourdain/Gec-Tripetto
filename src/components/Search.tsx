import { useNavigation } from "react-router";
import { Form, useSubmit } from "react-router-dom";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import SyncIcon from "@mui/icons-material/Sync";

const Search = () => {
  const navigation = useNavigation();
  const submit = useSubmit();

  const form = "";
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("titre");

  return (
    <Form role="search">
      <Input
        id="input-search"
        aria-label="Recherche formulaire"
        name="titre"
        startAdornment={<InputAdornment position="start">{searching ? <SyncIcon /> : <SearchIcon />}</InputAdornment>}
        placeholder="recherche"
        onChange={(event) => {
          const isFirstSearch = form == null;
          submit(event.currentTarget.form, {
            replace: !isFirstSearch,
          });
        }}
      />
    </Form>
  );
};

export default Search;
