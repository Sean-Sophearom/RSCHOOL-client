import { Paper, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../userContext";
import axios from "axios";
import { Box } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    maxWidth: theme.maxWidth,
    marginInline: "auto",
  },
  container: { maxWidth: theme.maxWidth, marginInline: "auto", marginTop: theme.spacing(2) },
  paper: {
    padding: theme.spacing(2.5),
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  icon: { transform: "scale(1.5)" },
  blue: { color: theme.palette.text.blue },
  green: { color: theme.palette.text.green },
  pink: { color: theme.palette.text.pink },
  yellow: { color: theme.palette.text.yellow },
}));

const MainContent = () => {
  const [user] = useContext(userContext);
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState({ questions: 0, chapters: 0, students: 0 });
  const classes = useStyle();

  useEffect(() => {
    const { token } = user;
    if (token && user.accType === "teacher") {
      axios({
        method: "get",
        url: "https://rschool-online.herokuapp.com/api/student",
        headers: { "auth-token": user.token },
      })
        .then((res) => setStudents(res.data))
        .catch((err) => console.log(err));
      axios({
        method: "get",
        url: "https://rschool-online.herokuapp.com/api/chapters",
        headers: { "auth-token": user.token },
      })
        .then((res) => {
          let questionCount = 0;
          let chapterCount = 0;
          res.data.forEach((chapter) => {
            chapterCount++;
            chapter.exercises.forEach((exercise) => {
              exercise.questions.forEach((question) => questionCount++);
            });
          });
          setCount((count) => ({ ...count, questions: questionCount, chapters: chapterCount }));
        })
        .catch((err) => console.log(err));
    }
  }, [user]);
  return (
    <>
      <Paper className={classes.root}>
        <Typography variant="h4" align="center" className={classes.blue}>
          Greeting {user.username}. Welcome to our website.
        </Typography>
      </Paper>

      <Box className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Link to="/students">
              <Paper className={classes.paper} sx={{}}>
                <Typography align="center" variant="h5" className={classes.green}>
                  {students.length}
                  <Typography>Students</Typography>
                </Typography>
                <PeopleIcon fontSize="large" className={`${classes.icon} ${classes.green}`} />
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Link to="/chapters">
              <Paper className={classes.paper} sx={{}}>
                <Typography align="center" variant="h5" className={classes.pink}>
                  {count.chapters}
                  <Typography>Chapters</Typography>
                </Typography>
                <LibraryBooksIcon fontSize="large" className={`${classes.icon} ${classes.pink}`} />
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Link to="/chapters">
              <Paper className={classes.paper} sx={{}}>
                <Typography align="center" variant="h5" className={classes.yellow}>
                  {count.questions}
                  <Typography> Questions</Typography>
                </Typography>
                <HelpIcon fontSize="large" className={`${classes.icon} ${classes.yellow}`} />
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper} sx={{}}>
              <Typography align="center" variant="h5" className={classes.blue}>
                0<Typography>Placeholder</Typography>
              </Typography>
              <HomeIcon fontSize="large" className={`${classes.icon} ${classes.blue}`} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MainContent;
