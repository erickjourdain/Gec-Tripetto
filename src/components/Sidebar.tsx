import { useNavigate, useSearchParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import Search from "./Search";
import { FormsResponse } from "../@types/formsReponse";

type SidebarProps = {
  open?: boolean;
  forms: FormsResponse;
  drawerwidth: number;
  onToggleDrawer: () => void;
};

interface DrawerProps extends MuiDrawerProps {
  open?: boolean;
  drawerwidth: number;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open, drawerwidth }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerwidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
    }),
  },
}));

const Sidebar = ({ forms, open, drawerwidth, onToggleDrawer }: SidebarProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const nextPage = () => {
    const page = searchParams.get("page");
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    const newPage = page ? (parseInt(page) + 1).toString() : "2";
    updatedSearchParams.set("page", newPage);
    setSearchParams(updatedSearchParams.toString());
  };

  const prevPage = () => {
    const page = searchParams.get("page");
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    const newPage = page && parseInt(page) > 1 ? (parseInt(page) - 1).toString() : "1";
    updatedSearchParams.set("page", newPage);
    setSearchParams(updatedSearchParams.toString());
  };

  const addForm = () => {
    console.log("hello");
    navigate("/ajouter");
  };

  const editForm = (slug: string) => {
    navigate(`/formulaire/${slug}/edit`);
  };

  const playForm = (slug: string) => {
    navigate(`/formulaire/${slug}`);
  };

  const resForm = (slug: string) => {
    navigate(`/formulaire/${slug}/data`);
  };

  return (
    <Drawer variant="permanent" open={open} drawerwidth={drawerwidth}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <Search />
        <IconButton aria-label="ajouter formulaire" onClick={addForm}>
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={onToggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {forms && forms.data.length ? (
          <>
            {forms.data.map((form) => (
              <ListItem
                key={form.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="start" onClick={() => playForm(form.slug)}>
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                    <IconButton edge="end" aria-label="result" onClick={() => resForm(form.slug)}>
                      <ListAltIcon fontSize="small" />
                    </IconButton>
                    <IconButton edge="end" aria-label="edit" onClick={() => editForm(form.slug)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={form.titre} />
              </ListItem>
            ))}
          </>
        ) : (
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Aucun formulaire trouvé
          </Typography>
        )}
      </List>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton color="primary" disabled={!forms.hasPrevious} onClick={prevPage}>
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton color="primary" disabled={!forms.hasNext} onClick={nextPage}>
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
