import { IconButton, Paper, Typography, Button, Snackbar, Alert, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { chaptersContext } from "../../ChaptersContext";
import { userContext } from "../../userContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

//modal
import DeleteModal from "./Modals/DeleteModal";
import AddQuestionModal from "./Modals/AddQuestionModal";

const useStyle = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    marginBottom: theme.spacing(1.5),
    maxWidth: theme.maxWidth,
    margin: "0 auto",
  },
  prevQuestionsContainer: {
    maxWidth: theme.maxWidth,
    marginInline: "auto",

    marginBottom: theme.spacing(2),
  },
  paper: {
    height: "100%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  addIconContainer: { position: "fixed", bottom: 35, right: 35 },
  saveIconContainer: { maxWidth: theme.maxWidth, display: "flex", justifyContent: "center", marginInline: "auto" },
  green: { color: "#03ac13" },
}));

const EditExercise = () => {
  const [chapters, setChapters] = useContext(chaptersContext);
  const [user] = useContext(userContext);
  const [currentExercise, setCurrentExercise] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [prevQuestions, setPrevQuestions] = useState([]);
  const { exerciseId, chapterId } = useParams();
  const history = useHistory();
  const classes = useStyle();

  useEffect(() => {
    let thisChapter;
    if (chapters) thisChapter = chapters?.find((item) => item._id === chapterId);
    if (!thisChapter) history.push("/chapters");
    const thisExercise = thisChapter?.exercises?.find((item) => item._id === exerciseId);
    if (!thisExercise) history.push(`/chapters/${chapterId}`);
    setCurrentExercise(thisExercise);
    setPrevQuestions(thisExercise?.questions);
  }, [chapters, chapterId, exerciseId, history]);

  useEffect(() => {
    const func = (e) => e.key === " " && setOpenAddModal(true);
    document.addEventListener("keydown", func);
    return () => document.removeEventListener("keydown", func);
  }, []);

  const thisExercise = chapters
    ?.find((item) => item._id === chapterId)
    ?.exercises.find((item) => item._id === exerciseId);

  const removeQuestion = (index) => {
    let newQuestionArray = [];
    for (let i = 0; i < prevQuestions.length; i++) {
      if (i !== index) newQuestionArray.push(prevQuestions[i]);
    }
    setPrevQuestions(newQuestionArray);
  };

  const handleDelete = () => {
    const thisChapter = chapters?.find((chapter) => chapter._id === chapterId);
    const { exercises } = thisChapter;
    const updatedExercises = exercises.filter((exercise) => exercise._id !== exerciseId);
    const updatedChapter = { ...thisChapter, exercises: updatedExercises };
    const updatedChapters = chapters.map((chapter) => (chapter._id !== chapterId ? chapter : updatedChapter));
    axios({
      method: "put",
      url: `https://rschool-online.herokuapp.com/api/chapters/${chapterId}`,
      headers: { "auth-token": user.token },
      data: { exercises: updatedExercises },
    }).then((res) => {
      setChapters(updatedChapters);
      history.push(`/chapters/${chapterId}`);
    });
  };

  const handleSave = async () => {
    setCurrentExercise({ ...currentExercise, questions: prevQuestions });
    let thisChapterUpdatedExercises;
    const updatedChapters = chapters.map((chapter) => {
      if (chapter._id !== chapterId) return chapter;
      const updatedExercises = chapter.exercises.map((exercise) => {
        if (exercise._id !== exerciseId) return exercise;
        return { ...currentExercise, questions: prevQuestions };
      });
      thisChapterUpdatedExercises = updatedExercises;
      return { ...chapter, exercises: updatedExercises };
    });
    setChapters(updatedChapters);
    axios({
      method: "put",
      url: `https://rschool-online.herokuapp.com/api/chapters/${chapterId}`,
      headers: { "auth-token": user.token },
      data: { exercises: thisChapterUpdatedExercises },
    }).catch((err) => console.log(err));
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Paper className={classes.root}>
        <Box sx={{ display: "flex", pb: 1 }}>
          <Link to={`/chapters/${chapterId}`}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>

          <Typography sx={{ flex: 1 }} />

          <IconButton onClick={() => setOpenDeleteModal(true)}>
            <DeleteForeverIcon color="secondary" />
          </IconButton>
        </Box>

        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          {currentExercise?.title}
        </Typography>

        {currentExercise?.instruction && (
          <Typography variant="h6" gutterBottom>
            Instruction: {currentExercise?.instruction}
          </Typography>
        )}

        <Typography sx={{ color: "gray" }}>
          (Please do not forget to save after you make any changes. Any progress made without saving wil be lost.)
        </Typography>
      </Paper>

      <Box className={classes.prevQuestionsContainer}>
        <Grid container spacing={1.5}>
          {prevQuestions.map((question, index) => (
            <Grid item xs={12} lg={6} key={Math.random()}>
              <Paper className={classes.paper}>
                <Box sx={{ display: "flex" }}>
                  <Typography sx={{ flex: 1, mb: 0.5 }}>
                    {index + 1}. {question?.title}
                  </Typography>

                  <IconButton onClick={() => removeQuestion(index)} sx={{ p: 0, alignSelf: "flex-start" }}>
                    <CancelIcon />
                  </IconButton>
                </Box>

                {question?.choices?.map((choice, i) => (
                  <Typography
                    key={i}
                    sx={{ ml: 2, mt: 0.25 }}
                    className={i === question.correct ? classes.green : null}
                  >
                    {choice}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={classes.addIconContainer}>
        <IconButton
          onClick={() => setOpenAddModal(true)}
          sx={{ background: "#65a9e8", color: "white", "&:hover": { background: "#5a9ddb" } }}
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Box>

      <Box className={classes.saveIconContainer}>
        <Button variant="contained" color="info" sx={{ px: 4 }} onClick={handleSave}>
          Save
        </Button>
      </Box>

      <AddQuestionModal
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        setPrevQuestions={setPrevQuestions}
        type={thisExercise?.type}
      />

      <DeleteModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDelete={handleDelete}
        type="exercise"
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Saved Successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditExercise;
