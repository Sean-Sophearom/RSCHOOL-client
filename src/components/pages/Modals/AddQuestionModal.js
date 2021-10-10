import { Button, IconButton, Modal, Radio, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ClearIcon from "@mui/icons-material/Clear";

const useStyle = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 300,
    maxWidth: theme.maxWidth,
    width: "90vw",
    background: theme.palette.white,
    border: "1px solid #000",
    borderRadius: 8,
    padding: theme.spacing(4),
    paddingInline: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  inputContainer: {
    maxWidth: theme.maxWidth,
    display: "flex",
    flexDirection: "column",
  },
}));

const AddQuestionModal = ({ open, handleClose, setPrevQuestions, type }) => {
  const classes = useStyle();
  const [answerChoices, setAnswerChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const answerChoiceRef = useRef();
  const questionRef = useRef();

  //just some eventlistener for keypress to make adding question
  //possible without moving the mouse thereby speeding up the process
  useEffect(() => {
    const func = (e) => {
      answerChoices.length === 2 && type === "two choices" && e.key === "Enter"
        ? addQuestion()
        : e.key === "1"
        ? setCorrectAnswer(0)
        : e.key === "2" && setCorrectAnswer(1);
      answerChoices.length === 4 && type !== "two choices" && e.key === "Enter"
        ? addQuestion()
        : e.key === "1"
        ? setCorrectAnswer(0)
        : e.key === "2"
        ? setCorrectAnswer(1)
        : e.key === "3"
        ? setCorrectAnswer(2)
        : e.key === "4" && setCorrectAnswer(3);
    };
    document.addEventListener("keydown", func);
    return () => document.removeEventListener("keydown", func);
  });

  useEffect(() => {
    type === "correct or incorrect" && setAnswerChoices(["1. correct", "2. incorrect"]);
  }, [type]);

  const addAnswerChoice = () => {
    const answer = answerChoiceRef.current.value;
    if (!answer) return;
    setAnswerChoices([...answerChoices, `${answerChoices.length + 1}. ${answer.trim()}`]);
    answerChoiceRef.current.value = "";
    answerChoiceRef.current.focus();
  };

  const addQuestion = () => {
    const ques = questionRef?.current?.value;
    if ((!ques && type !== "two choices") || answerChoices.length < 2) return;
    const title = ques?.trim() || "";
    setPrevQuestions((prev) => {
      const newQuestion = {
        title,
        studentsChoice: null,
        choices: answerChoices,
        correct: correctAnswer + 1,
      };
      type === "multiple choices" && answerChoiceRef?.current?.value && (answerChoiceRef.current.value = "");
      type === "multiple choices" && questionRef?.current?.value && (questionRef.current.value = "");
      type === "correct or incorrect" ? setAnswerChoices(["1. correct", "2. incorrect"]) : setAnswerChoices([]);
      setCorrectAnswer(0);
      return [...prev, newQuestion];
    });
    handleClose();
  };

  const handleQuestionKeyUp = (e) => {
    if ("1234".includes(e.key)) questionRef.current.value = questionRef.current.value.slice(0, -1);
    if (e.key === "Enter") {
      if (type === "multiple choices") {
        questionRef.current.value = questionRef.current.value.slice(0, -1);
        answerChoiceRef.current.focus();
      } else if (type === "correct or incorrect") {
        addQuestion();
      }
    }
  };

  const handleAnswerKeyUp = (e) => {
    if (e.key === "Enter") {
      if (answerChoices.length === 4) return addQuestion();
      if (!answerChoiceRef.current.value) return;
      addAnswerChoice();
    }
  };

  const handleReset = () => {
    type === "correct or incorrect" ? setAnswerChoices(["1. correct", "2. incorrect"]) : setAnswerChoices([]);
    if (answerChoices.length !== 2 && type !== "two choices") {
      answerChoiceRef.current.value = "";
      answerChoiceRef.current.focus();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.root}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ flex: 1 }} />
            <IconButton onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            Add a New Question
          </Typography>

          {type !== "two choices" && (
            <Box className={classes.questionContainer}>
              <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>
                Question Title
              </Typography>
              <TextField
                onKeyUp={handleQuestionKeyUp}
                inputRef={questionRef}
                autoFocus
                required
                label="Question"
                multiline
                fullWidth
                size="small"
              />
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ flex: 1 }} variant="h6">
              Answer Choices
            </Typography>

            <Button color="info" onClick={handleReset}>
              Reset
            </Button>
          </Box>
          <Typography variant="body2" gutterBottom>
            Tick the box for the correct choice.
          </Typography>

          {answerChoices?.map((answer, index) => (
            <Box key={index} sx={{ display: "flex", ml: 2, alignItems: "center" }}>
              <Radio
                size="small"
                checked={Number(correctAnswer) === Number(index)}
                value={index}
                onChange={() => setCorrectAnswer(index)}
              />
              <Typography sx={{ cursor: "pointer" }} onClick={() => setCorrectAnswer(index)}>
                {answer}
              </Typography>
            </Box>
          ))}

          {((answerChoices.length !== 2 && type === "two choices") ||
            (type === "multiple choices" && answerChoices.length !== 4)) && (
            <Box sx={{ display: "flex", mt: 1 }}>
              <IconButton onClick={addAnswerChoice} sx={{ alignSelf: "center" }}>
                <ControlPointIcon />
              </IconButton>
              <TextField
                autoFocus={type === "two choices"}
                inputRef={answerChoiceRef}
                sx={{ flex: 1 }}
                label={`Choice ${answerChoices.length + 1}`}
                multiline
                fullWidth
                size="small"
                onKeyUp={handleAnswerKeyUp}
              />
            </Box>
          )}

          <Button color="info" variant="contained" sx={{ alignSelf: "center", mt: 1 }} onClick={addQuestion}>
            Add Question
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddQuestionModal;
