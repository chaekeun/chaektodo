import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Register from "./components/register";
import Tasks from "./components/tasks";
import { React, useEffect, useState } from "react";
import axios from "axios";
import Write from "./components/write";
import NotFound from "./components/notFound";
import Fail from "./components/fail";
import Home from "./components/home";

function App() {
  let [tasks, setTasks] = useState([]);
  let [timer, setTimer] = useState("");

  function Timer() {
    const currentTimer = () => {
      let today = new Date();
      today = today.toLocaleString("ko-kr");
      setTimer(today);
    };

    const startTimer = () => {
      setInterval(currentTimer, 1000);
    };
    startTimer();
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/fail" element={<Fail></Fail>}></Route>

        <Route
          path="/tasks/:user"
          element={
            <div>
              <Timer /> <h4>{timer}</h4>
              <Tasks tasks={tasks} setTasks={setTasks}></Tasks>
            </div>
          }
        ></Route>
        <Route path="/write" element={<Write timer={timer}></Write>}></Route>

        <Route path="/*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </div>
  );
}

export default App;
