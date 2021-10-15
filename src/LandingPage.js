import React, { useContext, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { userContext } from "./userContext";

//mui
import { makeStyles } from "@mui/styles";
import { Typography, Button, Container, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import MicIcon from "@mui/icons-material/Mic";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

//img
import img from "./img/students.jpg";

const useStyle = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("md")]: { maxWidth: 800, marginInline: "auto" },
    [theme.breakpoints.up("md")]: { maxWidth: 1000, marginInline: "auto" },
    [theme.breakpoints.up("lg")]: { maxWidth: 1200, marginInline: "auto" },
  },
  navContainer: {
    zindex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBlock: theme.spacing(1),
  },
  navItemsContainer: {
    zIndex: 0,
    display: "flex",
    gap: 32,
    alignItems: "center",
    color: theme.palette.text.gray,
    fontWeight: 500,
    transition: "all .75s",
    [theme.breakpoints.down("sm")]: {
      //   display: (toggle) => (toggle ? "flex" : "none"),
      maxHeight: (toggle) => (toggle ? "181px" : "0px"),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: theme.palette.white,
      position: "absolute",
      borderTop: "1px solid lightGray",
      left: 0,
      top: 56,
      width: "100vw",
      overflowY: "hidden",
      gap: 0,
      "& a": { marginBlock: theme.spacing(2) },
    },
  },
  menuIconContainer: {
    [theme.breakpoints.up("sm")]: { display: "none" },
  },

  imgContainer: {
    width: "100vw",
    minHeight: "580px",
    background: `url(${img}) no-repeat center top`,
    backgroundSize: "cover",
  },
  bgColor: {
    background: "rgba(12, 11, 11, 0.82)",
    width: "100%",
    minHeight: "580px",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    color: theme.palette.white,
  },
  typingText: {
    animation: " $blink .5s step-end infinite alternate",
    borderRight: "3px solid",
  },

  "@keyframes blink": {
    "50%": {
      borderColor: "transparent",
    },
  },
  features: {
    marginTop: theme.spacing(2),
    display: "flex",
    gap: 32,
    [theme.breakpoints.down("md")]: { flexDirection: "column" },
  },
  feature: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    [theme.breakpoints.up("md")]: { flexDirection: "column", alignItems: "center" },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      borderBottom: "1px solid lightGray",
      paddingBottom: theme.spacing(4),
    },
  },
  quoteContainer: { display: "flex", gap: 20, [theme.breakpoints.down("sm")]: { flexDirection: "column" } },
  quote: { color: theme.palette.text.gray, background: theme.palette.white, fontSize: 18, padding: theme.spacing(2) },
  footerContainer: {
    display: "flex",
    gap: 32,
    justifyContent: "space-evenly",
    [theme.breakpoints.down("md")]: { flexDirection: "column", textAlign: "center" },
  },
  blue: { color: theme.palette.text.blue },
  yellow: { color: theme.palette.text.yellow },
  gray: { color: theme.palette.text.gray },
  icon: { transform: "scale(1.5)" },
  blackBg: {
    background: "#111111",
    color: theme.palette.text.gray,
    paddingBlock: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
}));

const LandingPage = () => {
  const [toggle, setToggle] = useState(false);
  const [text, setText] = useState('"');
  const [index, setIndex] = useState(1);
  const [iteration, setIteration] = useState(0);
  const classes = useStyle(toggle);
  const history = useHistory();
  const [user] = useContext(userContext);

  const features = [
    {
      icon: <SchoolIcon fontSize="large" className={`${classes.blue} ${classes.icon}`} />,
      title: "What is RSCHOOL Online?",
      description:
        "The SPEL Online courses provide a convenient and flexible option for students who have time constraint and would like to practice their English independently outside of their face-to-face classes. It allows you to acquire English in natural and fun ways through a continuous blend of activities and practices. You can access the online courses from your own computer or smart phone with an internet connection and at any time you are available.",
    },
    {
      icon: <MicIcon fontSize="large" className={`${classes.blue} ${classes.icon}`} />,
      title: "Speech recognition system",
      description:
        "If you would like to improve your pronunciation and speaking skills, the PUC SPEL Online program is the right fit for you. You can practice pronouncing words and sentences, and the online system can verify if the pronunciation is correct or not and even give the percentage of correction.",
    },
    {
      icon: <CelebrationIcon fontSize="large" className={`${classes.blue} ${classes.icon}`} />,
      title: "Want to know your English level?",
      description:
        "Students are required to take an online placement test in order to determine their English levels. The 45-min placement test assesses students’ vocabulary, grammar, listening, and reading skills. The test will place students in 6 levels: Beginner, Elementary, Pre-intermediate, Intermediate, Upper-intermediate, and Advanced. Students can take the test from anywhere with a computer or smart phone having internet access.",
    },
  ];

  useEffect(() => {
    const myText1 = '"Learning Today . . . Leading Tomorrow."';
    const myText2 = '"Education is of the utmost importance . . ."';
    if (iteration === 0) {
      const timeOut1 = setTimeout(() => {
        setIndex(index + 1);
        setText((prev) => {
          prev + myText1[index] === myText1 && setIteration((prev) => prev + 1);
          return prev + (myText1[index] || "");
        });
      }, 50);
    }
    if (iteration === 1) {
      const timeOut2 = setTimeout(() => {
        setIndex(index - 1);
        setText((prev) => {
          !prev.slice(0, -1) && setIteration((prev) => prev + 1);
          return prev.slice(0, -1);
        });
      }, 25);
    }
    if (iteration === 2) {
      const timeOut2 = setTimeout(() => {
        setIndex(index + 1);
        setText((prev) => {
          prev + myText2[index] === myText2 && setIteration((prev) => prev + 1);
          return prev + (myText2[index] || "");
        });
      }, 50);
    }
    if (iteration === 3) {
      const timeOut2 = setTimeout(() => {
        setIndex(index - 1);
        setText((prev) => {
          !prev.slice(0, -1) && setIteration(0);
          return prev.slice(0, -1);
        });
      }, 50);
    }
  }, [index]);

  useEffect(() => (localStorage.getItem("user") || user) && history.push("/home"));
  return (
    <>
      <Container className={classes.container}>
        <nav className={classes.nav}>
          <div className={classes.navContainer}>
            <Link to="/user/login">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <span className={classes.blue}>RSCHOOL </span>
                <span className={classes.yellow}>Online</span>
              </Typography>
            </Link>

            <div className={classes.navItemsContainer}>
              <a href="#features">
                <Typography>Features</Typography>
              </a>
              <a href="#feedbacks">
                <Typography>Feedbacks</Typography>
              </a>
              <Button
                variant="contained"
                color="info"
                component="a"
                onClick={() => history.push("/user/login")}
                sx={{ borderRadius: 6 }}
              >
                Log In
              </Button>
            </div>

            <div className={classes.menuIconContainer}>
              <IconButton onClick={() => setToggle(!toggle)}>
                <MenuIcon />
              </IconButton>
            </div>
          </div>
        </nav>
      </Container>

      <main className={classes.imgContainer}>
        <Box className={classes.bgColor}>
          <Container className={classes.container}>
            <Typography display="inline-block" variant="h3" className={classes.yellow} sx={{ border: 3, p: 1, px: 3 }}>
              <span className={classes.blue}>RSCHOOL </span>
              <span className={classes.yellow}>Online</span>
            </Typography>
            <Box sx={{ display: "grid", placeItems: "center", mt: 2 }}>
              <Typography variant="h5" className={classes.typingText}>
                {text}
              </Typography>
            </Box>
            <Typography sx={{ my: 3 }}>A responsive web-based English tutoring system</Typography>
            <Button variant="contained" color="info">
              <Link to="/user/login">Study Now</Link>
            </Button>
          </Container>
        </Box>
      </main>

      <Container id="features" className={classes.container} sx={{ mt: 8 }}>
        <Typography variant="h5" align="center">
          Features
        </Typography>
        <Typography align="center" pt={2} pb={4} className={classes.gray}>
          RSCHOOL Online is a web-based English language tutoring system developed by Me, Phearom.
        </Typography>

        <Box className={classes.features}>
          {features.map((item, index) => (
            <Box className={classes.feature} key={index}>
              <Box>{item.icon}</Box>
              <Box>
                <Typography variant="h6" mb={1}>
                  {item.title}
                </Typography>
                <Typography className={classes.gray}>{item.description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      <Box className={classes.blackBg} id="feedbacks">
        <Container className={classes.container}>
          <Typography align="center" variant="h5">
            See What Our Students Are Saying
          </Typography>
          <Typography align="center" my={3}>
            They are working in many industries in Cambodia: banking, law, accounting, consulting, and education
          </Typography>
          <Box className={classes.quoteContainer}>
            <Typography className={classes.quote}>
              "RSCHOOL Online courses are specially designed for professionals with busy work schedule who wish to
              enhance their skills. "
            </Typography>
            <Typography className={classes.quote}>
              "At the end of the course, students will take an online achievement test before they can move on to the
              next level. "
            </Typography>
          </Box>
        </Container>
      </Box>

      <footer className={classes.blackBg}>
        <Container className={classes.container}>
          <Box className={classes.footerContainer}>
            <Box>
              <Typography variant="h5" align="center">
                Contact Me
              </Typography>

              <Box sx={{ display: "flex", mt: 1, flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <EmailIcon />
                  <Typography>sean.sophearom77@gmail.com</Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <FacebookIcon />
                  <a href="https://www.facebook.com/profile.php?id=100009382016475">
                    <Typography>Sean Sophearom</Typography>
                  </a>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <PhoneIphoneIcon />
                  <Typography>0964260853</Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                <SettingsIcon fontSize="large" />
                <Typography variant="h5" align="center">
                  Developed by Sean Sophearom
                </Typography>
              </Box>
              <Typography align="center">Copyright © Sean Sopehearom 2021</Typography>
            </Box>
          </Box>
        </Container>
      </footer>
    </>
  );
};

export default LandingPage;
