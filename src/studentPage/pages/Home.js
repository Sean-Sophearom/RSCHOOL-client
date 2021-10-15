import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { userContext } from "../../userContext";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HelpIcon from "@mui/icons-material/Help";
import AlarmIcon from "@mui/icons-material/Alarm";
import VisibilityIcon from "@mui/icons-material/Visibility";

const useStyle = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
    },
    marginInline: "auto",
  },
  container: { marginInline: "auto", marginTop: theme.spacing(2.5) },
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
  blueBg: { background: theme.palette.text.blue, padding: theme.spacing(3), color: theme.palette.white },
}));

const Home = () => {
  const classes = useStyle();
  const [user, setUser] = useContext(userContext);
  const [displayChapter, setDisplayChapter] = useState({});

  useEffect(() => {
    //check for the chapter that has not been done yet
    // const newDisplayChapter =
    //   user?.chapters?.filter((chapter) => {
    //     chapter?.exercises?.forEach((exercise) => {
    //       exercise?.questions.forEach((question) => {
    //         if (question?.studentsChoice) return false;
    //       });
    //     });
    //     return true;
    //   }) || [];
    // setDisplayChapter(newDisplayChapter[0] || user?.chapters?.slice(-1)[0]);

    //the above function is currently broken so im just randomly picking chapter to display for now
    let index = Math.floor(Math.random() * user?.chapters?.length);
    setDisplayChapter(user?.chapters[index]);
  }, [user]);

  useEffect(() => {
    if (isNaN(user.done)) {
      const { numOfDone, numOfCorrectlyDone, numOfQuestions } = user;
      let { end } = user;
      //calculate daysLeft
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      let today = Date.now();
      end = new Date(end);
      const daysLeft = Math.round(Math.abs((end - today) / oneDay));
      //calculate done and correctly to display below
      const done = Math.floor((numOfDone / numOfQuestions) * 100);
      const doneCorrectly = Math.floor((numOfCorrectlyDone / numOfQuestions) * 100);
      setUser((prev) => ({ ...prev, done, doneCorrectly, daysLeft }));
    }
  }, [user, setUser]);

  return (
    <>
      <Paper className={classes.root}>
        <Typography
          variant="h2"
          className={classes.blue}
          sx={{ fontWeight: "bold", fontSize: { xs: 40, sm: 60 } }}
          gutterBottom
        >
          {displayChapter?.title}
        </Typography>
        {displayChapter?.description?.map((item) => (
          <Typography key={item} sx={{ color: "gray" }}>
            -{item}
          </Typography>
        ))}
        <Link to="/courses">
          <Button sx={{ mt: 3 }} variant="contained" color="info">
            Study Now
          </Button>
        </Link>
      </Paper>

      <Box className={classes.container}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} lg={3}>
            <Paper square className={classes.paper}>
              <Typography align="center" variant="h4" className={classes.yellow}>
                {user?.done}%<Typography>Done</Typography>
              </Typography>
              <MenuBookIcon fontSize="large" className={`${classes.icon} ${classes.yellow}`} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper square className={classes.paper}>
              <Typography align="center" variant="h4" className={classes.green}>
                {user?.doneCorrectly}%<Typography>Correctly</Typography>
              </Typography>
              <HelpIcon fontSize="large" className={`${classes.icon} ${classes.green}`} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper square className={classes.paper}>
              <Typography align="center" variant="h4" className={classes.pink}>
                {user?.daysLeft}
                <Typography>Days Left</Typography>
              </Typography>
              <AlarmIcon fontSize="large" className={`${classes.icon} ${classes.pink}`} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Paper square className={classes.paper}>
              <Typography align="center" variant="h4" className={classes.blue}>
                {user.done === 100 ? (user.doneCorrectly > 50 ? "Passes" : "Failed") : "Studying"}
                <Typography>Status</Typography>
              </Typography>
              <VisibilityIcon fontSize="large" className={`${classes.icon} ${classes.blue}`} />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Paper square>
          <Typography className={classes.blueBg}>Tutor: {user.teacher}</Typography>
        </Paper>
        <Paper square sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MailOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">sean.sophearom77@gmail.com</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
            <PhoneIphoneIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">0964260853</Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Home;
