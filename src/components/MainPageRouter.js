import React from "react";
import { Switch, Route } from "react-router-dom";

//mui
import { Container, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";

//pages
import MainContent from "./pages/MainContent";
import AllStudents from "./pages/AllStudents";
import AllChapters from "./pages/AllChapters";
import AddStudent from "./pages/AddStudent";
import EditChapter from "./pages/EditChapter";
import EditExercise from "./pages/EditExercise";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    background: theme.palette.bg.dark,
    [theme.breakpoints.up("md")]: {
      paddingLeft: (props) => (props.openLeftbar ? "225px" : "0px"),
    },
    [theme.breakpoints.down("md")]: {
      transform: (props) => (props.openLeftbar ? "translateX(225px)" : "translateX(0)"),
    },
    transition: "all .35s",
  },
  container: {
    boxSizing: "border-box",
    minWidth: "100%",
    minHeight: "calc(100vh - 275px)",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    background: theme.palette.bg.dark,
    color: theme.palette.gray,
  },
}));

const MainPageRouter = (props) => {
  const classes = useStyles(props);

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        {/* Toolbar here is to compensate for the height taken by the fixed AppBar */}
        <Toolbar />
        <Switch>
          <Route path="/home" exact component={MainContent} />
          <Route path="/students" exact component={AllStudents} />
          <Route path="/students/add" exact component={AddStudent} />
          <Route path="/chapters" exact component={AllChapters} />
          <Route path="/chapters/:id" exact component={EditChapter} />
          <Route path="/chapters/:chapterId/:exerciseId" component={EditExercise} />
        </Switch>
      </Container>
    </Box>
  );
};

export default MainPageRouter;
