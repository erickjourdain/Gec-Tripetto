import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import manageError from "../utils/manageError";

interface ErrorAlertProps {
  error: unknown;
}

const ErrorAlert = ({ error }: ErrorAlertProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {manageError(error)}
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;
