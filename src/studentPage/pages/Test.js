import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyle = makeStyles((theme) => ({
  root: {
    marginInline: "auto",
    maxWidth: theme.maxWidth,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingInline: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
}));

const Test = () => {
  const classes = useStyle();

  return <Paper className={classes.root}>UNDER CONSTRUCTION</Paper>;
};

export default Test;
