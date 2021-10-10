import { Typography, Paper, Box, Grid, Radio, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../userContext";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const useStyle = makeStyles((theme) => ({
  root: {
    marginInline: "auto",
    maxWidth: theme.maxWidth,
    padding: theme.spacing(4),
    paddingInline: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  gridContainer: {
    paddingTop: theme.spacing(1.5),
    [theme.breakpoints.up("sm")]: { "&>:nth-child(n)": { "&>:nth-child(n)": { paddingLeft: theme.spacing(8) } } },
    [theme.breakpoints.up("lg")]: {
      "&>:nth-child(odd)": { "&>:nth-child(n)": { paddingLeft: theme.spacing(8) } },
      "&>:nth-child(even)": { "&>:nth-child(n)": { paddingRight: theme.spacing(8) } },
    },
  },
  paper: {
    height: "100%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    maxWidth: theme.maxWidth,
    marginInline: "auto",
  },
  radioContainer: { display: "flex", alignItems: "center", gap: 2 },
  buttonContainer: {
    marginTop: theme.spacing(1.5),
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  green: { color: theme.palette.text.green },
  red: { color: "red" },
  blue: { color: theme.palette.text.blue },
  greenBg: { background: theme.palette.text.green },
  yellowBg: { background: theme.palette.text.yellow },
  pointer: { cursor: "pointer" },
}));

const Exercise = () => {
  const classes = useStyle();
  const { chapterId, exerciseId } = useParams();
  const [data, setData] = useState({});
  const [choices, setChoices] = useState([]);
  const [msg, setMsg] = useState({ msg: "", show: false, variant: "body2" });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [user, setUser] = useContext(userContext);
  const history = useHistory();

  //filter this exercise from the data from api to display later
  useEffect(() => {
    let thisChapter;
    if (user?.chapters) thisChapter = user.chapters.find((chapter) => chapter._id === chapterId);
    const thisExercise = thisChapter?.exercises?.find((exercise) => exercise._id === exerciseId);

    //index of this exercise
    const index = thisChapter?.exercises?.indexOf(thisExercise);

    //next exercise to link when student submits
    const nextExerciseId = thisChapter?.exercises[index + 1]?._id;

    setData({ nextExerciseId, chapter: thisChapter, exercise: thisExercise, index: index + 1 });

    //check if student has already done this exercise if so we disable most functionalities
    console.log(user);
    if (thisExercise.questions[0].studentsChoice !== null) {
      setHasSubmitted(true);

      //calculate the score
      let total = 0;
      let correct = 0;
      thisExercise.questions.forEach((question) => {
        total++;
        if (question.studentsChoice === question.correct) correct++;
        setMsg({ msg: `${correct}/${total}`, show: true, variant: "h6" });
      });
    } else {
      //initialize the choices array
      const choicesArr = [];
      for (let questions of thisExercise.questions) {
        choicesArr.push(-1);
      }
      setChoices(choicesArr);
    }
  }, [user, chapterId, exerciseId]);

  const handleSelect = (qIndex, choiceIndex) => {
    const updatedChoicesArr = [...choices];
    updatedChoicesArr[qIndex] = choiceIndex;
    setChoices(updatedChoicesArr);
  };

  const generateTitle = (index, title) => {
    if (!title?.includes("_"))
      return (
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
          {index + 1}. {title}
        </Typography>
      );
    const [part1, part2] = title.split("_");
    console.log(part1);
    console.log(part2);
    return (
      <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
        {index + 1}. {part1}{" "}
        <span style={{ display: "inline-block", width: "10ch", borderBottom: "1px solid black" }}></span> {part2}
      </Typography>
    );
  };

  const handleSubmit = () => {
    //if they haven't completed all questions
    if (choices.includes(-1))
      return setMsg({ msg: "*You haven't answered all questions.", show: true, variant: "body2" });
    setHasSubmitted(true);
    const updatedQuestions = data.exercise.questions.map((question, index) => ({
      ...question,
      studentsChoice: choices[index],
    }));
    const updatedExercise = { ...data.exercise, questions: updatedQuestions };

    //this is to render to the page
    setData({ ...data, exercise: updatedExercise });

    //calculate the score
    let total = 0;
    let correct = 0;
    updatedQuestions.forEach((question) => {
      total++;
      if (question.studentsChoice === question.correct) {
        correct++;
      }
      //this is to render to the page
      setMsg({ msg: `${correct}/${total}`, show: true, variant: "h6" });
    });
    //this is the score to update the db
    const numOfDone = user.numOfDone + total;
    const numOfCorrectlyDone = user.numOfCorrectlyDone + correct;

    //this is to updated the db through the api
    const updatedExercises = data.chapter.exercises.map((exercise) =>
      exercise._id === exerciseId ? updatedExercise : exercise
    );

    axios({
      method: "put",
      url: "https://rschool-online.herokuapp.com/api/student",
      headers: { "auth-token": user.token },
      data: { chapterId, exercises: updatedExercises, numOfDone, numOfCorrectlyDone },
    })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  };

  const generateClass = (index, correct, studentsChoice) => {
    if (!hasSubmitted) return classes.pointer;
    if (index === correct) return classes.green;
    if (studentsChoice !== correct) {
      if (index === studentsChoice) return classes.red;
    }
  };

  return (
    <Box>
      <Paper className={classes.root} square>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography variant="h4" align="center">
            {data?.chapter?.title}
          </Typography>
          {hasSubmitted && (
            <Typography variant="h6" sx={{ border: 1, px: 1, py: 0.5, color: "gray" }}>
              {msg.msg}
            </Typography>
          )}
        </Box>

        <Box sx={{ border: 1, p: { xs: 1, md: 2 }, mt: 2 }}>
          <Typography variant="h6">
            {data?.index}. {data?.exercise?.title}
          </Typography>

          <Typography>{data?.exercise?.instruction}</Typography>
        </Box>
      </Paper>

      <Grid container spacing={1.5} className={classes.gridContainer}>
        {data?.exercise?.questions?.map((question, questionIndex) => (
          <Grid item xs={12} key={questionIndex}>
            <Paper className={classes.paper} square>
              {generateTitle(questionIndex, question.title)}

              <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                {question.choices.map((choice, choiceIndex) => (
                  <Box key={Math.random()} className={classes.radioContainer}>
                    {hasSubmitted || (
                      <Radio
                        size="small"
                        onChange={() => handleSelect(questionIndex, choiceIndex)}
                        checked={choices[questionIndex] === choiceIndex}
                      />
                    )}
                    <Typography
                      onClick={() => handleSelect(questionIndex, choiceIndex)}
                      className={generateClass(choiceIndex, question.correct, question.studentsChoice)}
                    >
                      {choice}
                    </Typography>

                    {question.studentsChoice !== question.correct && question.studentsChoice === choiceIndex && (
                      <CloseIcon className={classes.red} />
                    )}

                    {question.studentsChoice === question.correct && question.studentsChoice === choiceIndex && (
                      <CheckIcon className={classes.green} />
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box className={classes.buttonContainer}>
        {msg.show && (
          <Typography className={classes.green} variant={msg.variant}>
            {msg.msg}
          </Typography>
        )}
        {hasSubmitted ? (
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button
              onClick={() => history.push("/home")}
              disableElevation
              sx={{
                background: "#fd7397",
                transition: "all 0.25s",
                "&:hover": { background: "#fd7397", filter: "brightness(1.2)" },
              }}
              variant="contained"
            >
              Home
            </Button>

            <Button
              href={data.nextExerciseId ? `/courses/${chapterId}/${data.nextExerciseId}` : "/courses"}
              disableElevation
              sx={{
                background: "#f8b32d",
                transition: "all 0.25s",
                "&:hover": { background: "#f8b32d", filter: "brightness(1.1)" },
              }}
              variant="contained"
            >
              Next
            </Button>
          </Box>
        ) : (
          <Button variant="contained" color="info" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Exercise;
