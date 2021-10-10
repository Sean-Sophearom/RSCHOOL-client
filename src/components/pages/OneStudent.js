import React, { useContext, useEffect } from "react";
import { userContext } from "../../userContext";

const OneStudent = () => {
  const [user] = useContext(userContext);
  const [student, setStudent] = useState();

  useEffect(() => {}, []);
  return <div></div>;
};

export default OneStudent;
