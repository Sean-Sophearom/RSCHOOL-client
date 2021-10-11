import { Typography, Paper, Box, Grid, Radio, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../userContext";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SendIcon from "@mui/icons-material/Send";

const useStyle = makeStyles((theme) => ({
  root: {
    marginInline: "auto",
    maxWidth: theme.maxWidth,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    paddingInline: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    gap: 16,
    [theme.breakpoints.up("md")]: { flexDirection: "row" },
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
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  green: { color: theme.palette.text.green },
  red: { color: "red" },
  blue: { color: theme.palette.text.blue },
  gray: { color: theme.palette.text.gray },
  greenBg: { background: theme.palette.text.green },
  yellowBg: { background: theme.palette.text.yellow },
  pointer: { cursor: "pointer" },
  blueRadio: { color: "red" },
}));

const Exercise = () => {
  const classes = useStyle();
  const { chapterId, exerciseId } = useParams();
  const headerRef = useRef();
  const [data, setData] = useState({});
  const [choices, setChoices] = useState([]);
  const [page, setPage] = useState({ count: 0, currentPage: 0 });
  const [msg, setMsg] = useState({ msg: "", show: false, variant: "body2" });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  //filter this exercise from the data from api to display below
  useEffect(() => {
    let thisChapter;
    if (user?.chapters) thisChapter = user.chapters.find((chapter) => chapter._id === chapterId);
    const thisExercise = thisChapter?.exercises?.find((exercise) => exercise._id === exerciseId);
    //indexing each question cause the data from database doesn't come with indices
    thisExercise.questions = thisExercise?.questions?.map((question, index) => {
      return { ...question, title: `${index + 1}. ${question.title}` };
    });

    //index of this exercise
    const index = thisChapter?.exercises?.indexOf(thisExercise);

    //next exercise to link when student submits
    const nextExerciseId = thisChapter?.exercises[index + 1]?._id;

    setData({ nextExerciseId, chapter: thisChapter, exercise: thisExercise, index: index + 1 });

    //check if student has already done this exercise if so we disable most functionalities
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
      setHasSubmitted(false);
      setMsg((prev) => ({ ...prev, show: false }));
      const choicesArr = [];
      for (let questions of thisExercise.questions) {
        choicesArr.push(-1);
      }
      setChoices(choicesArr);
    }

    //paginate the questions
    const pagesCount = Math.ceil(thisExercise.questions.length / 10) - 1;
    setPage((page) => ({ count: pagesCount, currentPage: 0 }));
  }, [user, chapterId, exerciseId]);

  const calculatePage = () => {
    const part1 = 10 * page.currentPage;
    const part2 = 10 + 10 * page.currentPage;
    return [part1, part2];
  };

  const generateTitle = (title) => {
    if (!title?.includes("_")) return <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>{title}</Typography>;
    const [part1, part2] = title.split("_");
    return (
      <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
        {part1} <span style={{ display: "inline-block", width: "10ch", borderBottom: "1px solid black" }}></span>
        {part2}
      </Typography>
    );
  };

  const handleSelect = (qIndex, choiceIndex) => {
    const updatedChoicesArr = [...choices];
    updatedChoicesArr[qIndex] = choiceIndex;
    setChoices(updatedChoicesArr);
  };

  const handleSubmit = () => {
    //if they haven't completed all questions
    if (choices.includes(-1))
      return setMsg({ msg: "*You haven't answered all questions.", show: true, variant: "body2" });

    setIsLoading(true);

    const updatedQuestions = data.exercise.questions.map((question, index) => ({
      ...question,
      studentsChoice: choices[index],
    }));
    const updatedExercise = { ...data.exercise, questions: updatedQuestions };

    //calculate the score
    let total = 0;
    let correct = 0;
    updatedQuestions.forEach((question) => {
      total++;
      if (question.studentsChoice === question.correct) {
        correct++;
      }
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
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setHasSubmitted(true);
        //this is to render to the page
        setData({ ...data, exercise: updatedExercise });
        //this is to render to the page as well
        setMsg({ msg: `${correct}/${total}`, show: true, variant: "h6" });
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  //extract the number or index from the question title. the minus one is to compensate for indicing.
  const getNum = (title) => Number(title.split(".")[0]) - 1;

  const generateClass = (index, correct, studentsChoice) => {
    if (!hasSubmitted) return classes.pointer;
    if (index === correct) return classes.green;
    if (studentsChoice !== correct) {
      if (index === studentsChoice) return classes.red;
    }
  };

  //function to go to next page or prev/last page
  const prevPage = () => {
    setPage({ ...page, currentPage: page.currentPage - 1 });
    headerRef.current.scrollIntoView();
  };
  const nextPage = () => {
    if (hasSubmitted && page.currentPage === page.count) {
      data.nextExerciseId ? history.push(`/courses/${chapterId}/${data.nextExerciseId}`) : history.push("/courses");
      headerRef.current.scrollIntoView();
    } else {
      setPage({ ...page, currentPage: page.currentPage + 1 });
      headerRef.current.scrollIntoView();
    }
  };

  return (
    <Box ref={headerRef}>
      <Paper className={classes.root} square>
        <Box className={classes.titleContainer}>
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

        <Typography fontSize={18} className={classes.gray} align="right" mt={4}>
          Page: {page.currentPage + 1}
        </Typography>
      </Paper>

      <Grid container spacing={1.5} className={classes.gridContainer}>
        {data?.exercise?.questions?.slice(...calculatePage()).map((question, questionIndex) => (
          <Grid item xs={12} key={questionIndex}>
            <Paper className={classes.paper} square>
              {generateTitle(question.title)}

              <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                {question.choices.map((choice, choiceIndex) => (
                  <Box key={Math.random()} className={classes.radioContainer}>
                    {hasSubmitted || (
                      <Radio
                        disableRipple
                        size="small"
                        onChange={() => handleSelect(getNum(question.title), choiceIndex)}
                        checked={choices[getNum(question.title)] === choiceIndex}
                      />
                    )}
                    <Typography
                      onClick={() => handleSelect(getNum(question.title), choiceIndex)}
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

      {msg.show && (
        <Typography className={classes.green} variant={msg.variant} align="center" mt={2}>
          {msg.msg}
        </Typography>
      )}

      {page.count !== page.currentPage || hasSubmitted ? (
        <Box className={classes.buttonContainer}>
          {page.currentPage !== 0 ? (
            <Button variant="contained" color="info" onClick={prevPage} startIcon={<ArrowBackIcon />}>
              back
            </Button>
          ) : (
            <Typography />
          )}
          <Button variant="contained" color="info" onClick={nextPage} endIcon={<ArrowForwardIcon />}>
            next
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <LoadingButton
            onClick={handleSubmit}
            loading={isLoading}
            variant="contained"
            color="info"
            endIcon={<SendIcon />}
          >
            Submit
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
};

export default Exercise;
