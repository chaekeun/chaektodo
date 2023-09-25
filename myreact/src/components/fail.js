import { React, useEffect, useState } from "react";
import axios from "axios";

function Fail() {
  let [errShow, setErrShow] = useState(false);
  let [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    fetchFlash();
  }, []);

  const fetchFlash = () => {
    axios
      .get("/api/fail")
      .then((res) => {
        setErrMessage(res.data[0]);
        console.log(res.data);
        console.log(errMessage);
        setErrShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/watch?v=c_l1ZwJbAnc"
        frameborder="0"
        allowfullscreen
      ></iframe>

      {errShow ? <p>{errMessage}</p> : <p>fail to load failureFlash</p>}
      <a href="/register">Register page로</a>
    </div>
  );
}

export default Fail;
