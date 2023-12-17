import { useState, MouseEvent } from "react";
import { useNavigate } from "react-router";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAppContext } from "../utils/appContext";
import { isAdmin } from "../utils/auth"
import { Context } from "../@types/context";

const options = ["Classic", "Autoscroll", "Chat"];

const Settings = () => {
  // récupération du contexte de l'application
  const { appContext, setAppContext } = useAppContext() as Context;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (i: number) => {
    setAppContext({
      ...appContext,
      runner: options[i],
    });
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {appContext.runner}
      <IconButton
        size="large"
        aria-label="paramètres"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((value, ind) => {
          return (
            <MenuItem onClick={() => handleClick(ind)} key={ind}>
              {value}
            </MenuItem>
          );
        })}
        {isAdmin() &&
          [
            <Divider key="divider"/>,
            <MenuItem key="admin" onClick={() => navigate("/admin")}>Administration</MenuItem>
          ]
        }
      </Menu>
    </Box>
  );
};

export default Settings;
