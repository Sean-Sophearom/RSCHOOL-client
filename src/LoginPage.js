import { Checkbox, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { userContext } from "./userContext";
import { useHistory } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const useStyle = makeStyles((theme) => ({
  "@keyframes onLoadAnimation": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  root: {
    animation: `$onLoadAnimation 1.25s ease`,
    height: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
  },
  logoContainer: {
    border: "none",
    position: "absolute",
    top: 0,
    left: 0,
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    },
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "0 16px",
    [theme.breakpoints.up("sm")]: {
      padding: 0,
    },
  },
  headerContainer: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(3),
    height: theme.spacing(10),
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    margin: `${theme.spacing(4)} 0`,
    "& button": {
      borderRadius: 20,
      color: theme.palette.white,
    },
    marginTop: theme.spacing(6),
  },
  blue: { color: theme.palette.text.blue },
  yellow: { color: theme.palette.text.yellow },
  gray: { color: theme.palette.text.gray },
  error: {
    color: "red",
    "&::before": {
      content: '"*"',
      color: "red",
    },
  },
}));

const LoginPage = () => {
  const classes = useStyle();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [error, setError] = useState({ username: "", password: "" });
  const [user, setUser] = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // if already logged in redirect to home page
  useEffect(() => {
    localStorage.getItem("user") && setUser(JSON.parse(localStorage.getItem("user")));
    user && history.push("/home");
  }, [user, history, setUser]);

  const handleSubmit = () => {
    if (!username) return setError({ ...error, username: "Please enter your username" });
    if (!password) return setError({ ...error, password: "Please enter your password" });
    setIsLoading(true);
    axios
      .post("https://rschool-online.herokuapp.com/api/auth/login", { username, password })
      .then((res) => {
        checkbox && localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        const errorMessage = err.response.data.message;
        if (!errorMessage.includes("password")) {
          return setError({ ...error, username: errorMessage });
        } else {
          return setError({ ...error, password: errorMessage });
        }
      });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.logoContainer}>
        <Typography variant="h5" display="inline">
          <span className={classes.blue}>RSCHOOL </span>
          <span className={classes.yellow}>Online</span>
        </Typography>
      </Box>

      <Box className={classes.mainContainer}>
        <Box className={classes.headerContainer}>
          <Typography variant="h4" component="h1" sx={{ mb: 1.25, fontSize: 30 }}>
            Sign in to {<span className={classes.blue}>RSCHOOL</span>} {<span className={classes.yellow}>Online</span>}
          </Typography>
          <Typography variant="body1" className={classes.gray}>
            Enter your details below
          </Typography>
        </Box>

        <Box className={classes.inputContainer}>
          <Typography variant="body1">Email Address or Phone Number</Typography>
          <OutlinedInput
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError({ ...error, username: "" });
            }}
            placeholder="Enter Email/Phone Number"
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          />
          {error.username && (
            <Typography variant="caption" className={classes.error}>
              {error.username}
            </Typography>
          )}
        </Box>

        <Box className={classes.inputContainer}>
          <Typography variant="body1">Password</Typography>
          <OutlinedInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError({ ...error, password: "" });
            }}
            placeholder="Enter Password"
            fullWidth
            size="small"
            sx={{ mt: 1 }}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
          />

          {error.password && (
            <Typography variant="caption" className={classes.error}>
              {error.password}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox checked={checkbox} onChange={(e) => setCheckbox(e.target.checked)} />
            <Typography>Keep me signed in</Typography>
          </Box>
        </Box>

        <Box className={classes.buttonContainer}>
          <LoadingButton loading={isLoading} variant="contained" onClick={handleSubmit}>
            Sign In
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
