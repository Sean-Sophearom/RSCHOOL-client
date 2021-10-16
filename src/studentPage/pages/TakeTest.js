import { Button, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../userContext";

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

const TakeTest = () => {
  const classes = useStyle();
  const [user] = useContext(userContext);
  //this is to determine whether or not student is eligible for the test
  const [canTake, setCanTake] = useState(false);

  useEffect(() => {
    if (user?.token) {
      if (user.numOfDone === user.numOfQuestions || user.numOfCorrectlyDone / user.numOfQuestions > 0.5) {
        setCanTake(true);
      }
    }
  }, [user]);

  return (
    <Paper className={classes.root}>
      {!canTake ? (
        <Typography variant="h5" align="center">
          You can't take the test yet. You must either complete the course entirely or have a score of at least 50% to
          be eligible to take the test.
        </Typography>
      ) : (
        <>
          <Typography variant="h5" align="center">
            You can take the test.
          </Typography>
          <Box sx={{ display: "grid", placeItems: "center", mt: 4 }}>
            <Button color="info" variant="contained" href={`/tests/${user._id}`}>
              Take now
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default TakeTest;
