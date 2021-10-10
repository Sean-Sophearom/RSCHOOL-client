import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { makeStyles } from "@mui/styles";
import { Typography, Box, Container } from "@mui/material";

const useStyle = makeStyles((theme) => ({
  root: {
    background: "#111",
    paddingBlock: theme.spacing(4),
    width: "100vw",
    [theme.breakpoints.up("md")]: {
      paddingLeft: (props) => (props.openLeftbar ? "225px" : "0px"),
    },
    [theme.breakpoints.down("md")]: {
      transform: (props) => (props.openLeftbar ? "translateX(225px)" : "translateX(0)"),
    },
    transition: "all .35s",
  },
  footerContainer: {
    background: "#111",
    boxSizing: "border-box",
    color: theme.palette.text.gray,
    minWidth: "100%",
    display: "flex",
    gap: 32,
    justifyContent: "space-evenly",
    [theme.breakpoints.down("md")]: { flexDirection: "column", textAlign: "center" },
  },
}));

const Footer = (props) => {
  const classes = useStyle(props);
  return (
    <Box className={classes.root}>
      <Box className={classes.footerContainer}>
        <Box>
          <Typography variant="h5" align="center">
            Contact Me
          </Typography>

          <Box sx={{ display: "flex", mt: 1, flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <EmailIcon />
              <Typography>sean.sophearom77@gmail.com</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <FacebookIcon />
              <a href="https://www.facebook.com/profile.php?id=100009382016475">
                <Typography>Sean Sophearom</Typography>
              </a>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <PhoneIphoneIcon />
              <Typography>0964260853</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
            <SettingsIcon fontSize="large" />
            <Typography variant="h5" align="center">
              Developed by Sean Sophearom
            </Typography>
          </Box>
          <Typography align="center">Copyright © Sean Sopehearom 2021</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
