import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { userContext } from "../../userContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";

const useStyle = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.bg.dark}`,
    maxWidth: theme.maxWidth,
    marginInline: "auto",
  },
  link: { "& :hover": { background: theme.palette.bg.dark } },
  listItem: {
    borderBottom: `1px solid ${theme.palette.bg.dark}`,
    padding: theme.spacing(1),
  },
  green: { color: theme.palette.text.green },
  yellow: { color: theme.palette.text.yellow },
}));

const Courses = () => {
  const classes = useStyle();
  const [user] = useContext(userContext);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const checkIsDone = (chapter) => {
    let isDone = true;
    chapter.exercises.forEach((exercise) => exercise.questions[0].studentsChoice === null && (isDone = false));
    return isDone;
  };

  const checkScore = ({ questions }) => {
    if (questions[0]?.studentsChoice === null) return null;
    let correct = 0;
    const total = questions.length;
    questions.forEach((question) => question.studentsChoice === question.correct && correct++);
    return `${correct}/${total}`;
  };

  return (
    <Paper sx={{ py: 4, px: 1.5 }} elevation={2}>
      <Typography variant="h4" align="center" mb={4}>
        All Exercises
      </Typography>
      <Box className={classes.root}>
        {user?.chapters?.map((chapter, index) => (
          <Accordion key={chapter._id} expanded={expanded === index} onChange={handleChange(index)} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Typography variant="h6">{chapter.title}</Typography>
                {checkIsDone(chapter) && <CheckIcon className={classes.green} />}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List sx={{ p: 0 }}>
                {chapter?.exercises?.map((exercise, index) => (
                  <Link key={exercise._id} to={`/courses/${chapter._id}/${exercise._id}`} className={classes.link}>
                    <ListItem className={classes.listItem} disablePadding>
                      <ListItemText primary={`${index + 1}. ${exercise.title}`} sx={{ ml: 3 }} />
                      <Typography className={classes.yellow} sx={{ fontWeight: 600 }} ml={2}>
                        {checkScore(exercise)}
                      </Typography>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};

export default Courses;
