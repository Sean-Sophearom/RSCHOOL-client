import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import Leftbar from "./Leftbar";
import Navbar from "./Navbar";
import { userContext } from "./userContext";

//this is the component that route to either student or teacher page based on the fetched accType
import TeacherPageRouter from "./components/MainPageRouter";
import StudentPageRouter from "./studentPage/MainPageRouter";
import ErrorPage from "./ErrorPage";
import Footer from "./Footer";

const useStyle = makeStyles({
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
    overflowX: 'hidden'
  },
});

const MainPageContainer = () => {
  const [openLeftbar, setOpenLeftbar] = useState(false);
  const [user, setUser] = useContext(userContext);
  const history = useHistory();
  const classes = useStyle();

  useEffect(() => {
    //if user is not logged in redirect to loginPage
    localStorage.getItem("user") && setUser(JSON.parse(localStorage.getItem("user")));
    !localStorage.getItem("user") && !user && history.push("/");
  }, [history, setUser]);

  return (
    <Box className={classes.root}>
      <Navbar setOpenLeftbar={setOpenLeftbar} />
      <Box sx={{ display: "flex", overflow: "hidden" }}>
        <Box>
          <Leftbar openLeftbar={openLeftbar} setOpenLeftbar={setOpenLeftbar} />
        </Box>
        <Box>
          {user?.accType === "teacher" ? (
            <TeacherPageRouter openLeftbar={openLeftbar} />
          ) : user?.accType === "student" ? (
            <StudentPageRouter openLeftbar={openLeftbar} />
          ) : (
            <ErrorPage />
          )}
        </Box>
      </Box>
      <Footer openLeftbar={openLeftbar} />
    </Box>
  );
};

export default MainPageContainer;
