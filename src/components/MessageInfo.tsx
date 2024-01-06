import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { Context } from "gec-tripetto";
import { useAppContext } from "../utils/appContext";


const MessageInfo = () => {
  // Chargement des données du Contexte de l'application
  const { appContext } = useAppContext() as Context;
  
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (appContext.alerte) setOpen(true);
  }, [appContext]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return ( appContext.alerte &&
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={appContext.alerte.severite} sx={{ width: "100%" }}>
        {appContext.alerte.message}
      </Alert>
    </Snackbar>
  );
}

export default MessageInfo;
