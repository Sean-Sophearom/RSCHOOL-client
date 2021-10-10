import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { userContext } from "./userContext";

//mui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";

//react router dom
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "transparent",
    maxHeight: 64,
    [theme.breakpoints.down("sm")]: {
      maxHeight: 56,
    },
  },
  toolbar: {
    backgroundColor: theme.palette.bg.light,
    color: theme.palette.text.gray,
    borderBottom: `1px solid ${theme.palette.bg.dark}`,
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
  extendedToolbar: {
    zIndex: (openExtended) => (openExtended ? "1" : "-100"),
    backgroundColor: theme.palette.bg.light,
    color: theme.palette.text.gray,
    borderBottom: `2px solid ${theme.palette.bg.dark}`,
    transform: (openExtended) => (openExtended ? "translateY(0)" : "translateY(-64px)"),
    transition: "all .35s ease",
  },
  blue: { color: theme.palette.text.blue },
  yellow: { color: theme.palette.text.yellow },
  logoContainer: { flex: 1, "& :hover": { filter: "brightness(1.075)" } },
}));

const Navbar = ({ setOpenLeftbar }) => {
  const [openExtended, setOpenExtended] = useState(false);
  const [, setUser] = useContext(userContext);
  const classes = useStyles(openExtended);
  const history = useHistory();

  const handleMenuClick = () => {
    setOpenExtended(false);
    setOpenLeftbar((prev) => !prev);
  };

  const handleLogout = () => {
    setUser(false);
    localStorage.removeItem("user");
    history.push("/");
  };
  return (
    <>
      <AppBar position="fixed" style={{ boxShadow: "none" }} className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <IconButton sx={{ mr: 1 }} onClick={handleMenuClick}>
            <MenuIcon></MenuIcon>
          </IconButton>
          <Box className={classes.logoContainer}>
            <Link to="/home">
              <Typography variant="h5" display="inline" className={classes.logo}>
                <span className={classes.blue}>RSCHOOL </span>
                <span className={classes.yellow}>Online</span>
              </Typography>
            </Link>
          </Box>
          <Box>
            <IconButton color="inherit" onClick={() => setOpenExtended(!openExtended)}>
              <AccountCircleIcon sx={{ display: { xs: "none", md: "initial" } }} fontSize="large" />
              <AccountCircleIcon sx={{ display: { xs: "initial", md: "none" } }} />
            </IconButton>
          </Box>
        </Toolbar>
        <Toolbar className={classes.extendedToolbar} tabIndex="0">
          <Typography sx={{ flex: 1 }}></Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
