import React from "react";
import { useState, useEffect } from "react";
import Quiz_answer from "./Quiz_answer";
import "./Quiz_answer.css";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import helpers from "./Services/Helper";
import $ from "jquery";

function Timeline() {
  const [username, setUsername] = useState();
  const [final_score, setfinal_score] = useState([0]);
  const [count, setCount] = useState(1);
  const [running, setRunning] = useState(true);
  const navigate = useNavigate();
  const { state } = useLocation();
  var counter = null;
  // useEffect(() => {
  //   setUsername(window.sessionStorage.getItem("username"));
  // }, []);

  function handle() {
    setCount(count + 1);
    document.getElementById(count).style.display = "block";
  }

  function move_next_page(e) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log(e.target.id);
    var a = parseInt(e.target.id) + 1;
    // console.log(a);
    document.getElementById("section" + a).disabled = false;

    document.getElementById("section" + a).style.opacity = "1";
    document.getElementById("section" + a).click();
    document.getElementById("section" + a + "_hr").style.backgroundColor =
      "black";
  }

  function section4_btn() {
    document.getElementById("fp-container").style.visibility = "visible";
    let sum = final_score.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue;
    });
    // return false;
    // axios
    //   .get("https://llklk.cu.ma/public/api/logout", {
    //     headers: {
    //       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    //     },
    //   })
    helpers
      .logout(state.score_id)
      .then((response) => {
        // toast(response.data, { type: "error" });
        navigate("/logout", { state: sum });
      })
      .catch(function (error) {
        alert(error.response.data.message);
      });
    // console.log("sum:", sum);
  }

  const score = (x) => {
    console.log("score:", x);
    setfinal_score([...final_score, x]);
  };

  function signout() {
    let text = "Are u sure want to log out?";
    if (window.confirm(text) == true) {
      section4_btn();
      setRunning(false);
    }
  }

  useEffect(() => {
    if (running) {
      var numOfMinutes = parseInt(state.timer);
      const dateCopy = new Date();
      var new_date = dateCopy.setMinutes(dateCopy.getMinutes() + numOfMinutes);
      var countDownDate = new Date(new_date).getTime();
      // move();
      // Update the count down every 1 second
      counter = setInterval(function () {
        // Get todays date and time
        var now = new Date(new Date() - 2000).getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;
        // console.log(new Date(distance));

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // console.log(seconds);

        // Output the result in an element with id="timer"
        // document.getElementById("timer").innerHTML =
        //   hours + "h " + minutes + "m " + seconds + "s ";

        document.getElementById("timer").innerHTML =
          "<div class='text-center'>" +
          hours +
          "<span>Hours</span></div>" +
          "<div class='text-center '>" +
          minutes +
          "<span>Minutes</span></div>" +
          "<div class='text-center '>" +
          seconds +
          "<span>Seconds</span></div>";

        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(counter);
          alert("u r gona to sign out");
          document.getElementById("4").click();
          // navigate("/");
          // setfinished(false);
        }
      }, 1000);
      let time = 0;

      // var startingMinutes = parseInt(state.timer);
      time = numOfMinutes * 60;
      //console.log(startingMinutes);
      //console.log(time);
      //if (time > 0) document.getElementById("myButton").disabled = true;
      var elem = document.getElementById("myBar");
      elem.style.width = 1 + "%";
      elem.style.transition = "width 1s ease-in";
      elem.innerHTML = 1 + "%";

      var setTime = numOfMinutes;
      var timeVar = 620 * setTime;

      if (setTime > 0) {
        var i = 1;
        var width = 1;
        var id = setInterval(frame, timeVar);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
            i = 0;
            //document.getElementById("myButton").disabled = false;
          } else {
            width++;
            elem.style.width = width + "%";
            elem.innerHTML = width + "%";
          }
        }
      }

      return () => clearInterval(counter);
    }
  }, [running]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // toggle 'scroll to top' based on scroll position
  window.addEventListener("scroll", (e) => {
    document.getElementById("scroll_top").style.display =
      window.scrollY > 20 ? "block" : "none";
  });

  return (
    <>
      <div
        className="fp-container"
        id="fp-container"
        style={{ visibility: "visible" }}
      >
        <i
          className="fas fa-spinner fa-pulse fp-loader"
          style={{ fontSize: "70px", float: "center" }}
        ></i>
      </div>
      <div className="quiz">
        {/* <ToastContainer position="top-right" theme="dark" /> */}
        <div>
          <div className="title sticky-top bg-white shadow">
            <ul
              className="container nav nav-pills py-3 px-1"
              id="pills-tab"
              role="tablist"
            >
              <li
                className="nav-item bg-white border border-dark p-1 rounded-pill shadow"
                role="presentation "
              >
                <button
                  className="  nav-link active rounded-pill "
                  id="section1"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-section1"
                  type="button"
                  role="tab"
                  aria-controls="pills-section1"
                  aria-selected="true"
                >
                  <i className="fa-solid fa-1 "></i>
                </button>
              </li>
              <hr className="hr" id="section2_hr" />

              <li
                className="nav-item bg-white border border-dark p-1 rounded-pill shadow"
                role="presentation"
              >
                <button
                  disabled="true"
                  className=" nav-link rounded-pill  timeline_btn"
                  id="section2"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-section2"
                  type="button"
                  role="tab"
                  aria-controls="pills-section2"
                  aria-selected="false"
                >
                  <i className="fa-solid fa-2 "></i>
                </button>
              </li>
              <hr className="hr" id="section3_hr" />

              <li
                className="nav-item bg-white border border-dark p-1 rounded-pill shadow"
                role="presentation"
              >
                <button
                  disabled="true"
                  className=" nav-link rounded-pill  timeline_btn"
                  id="section3"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-section3"
                  type="button"
                  role="tab"
                  aria-controls="pills-section3"
                  aria-selected="false"
                >
                  <i className="fa-solid fa-3 "></i>
                </button>
              </li>
              <hr className="hr" id="section4_hr" />

              <li
                className="nav-item bg-white border border-dark p-1 rounded-pill shadow"
                role="presentation"
              >
                <button
                  disabled="true"
                  className=" nav-link rounded-pill  timeline_btn"
                  id="section4"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-section4"
                  type="button"
                  role="tab"
                  aria-controls="pills-section4"
                  aria-selected="false"
                >
                  <i className="fa-solid fa-4 "></i>
                </button>
              </li>
            </ul>
          </div>
          <div
            id="myProgress"
            className="mb-2"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Timer"
          >
            <div id="myBar" className="shadow">
              1%
            </div>
          </div>

          <div className="top_header d-flex justify-content-between align-items-start">
            <div>
              <h5>Welcome {state.username}</h5>
            </div>
            <div>
              <p id="timer"></p>
            </div>
            <div className="logout">
              <button
                className="px-2 py-2 rounded-circle  shadow"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Logout"
                onClick={signout}
              >
                <i className="fas fa-sign-out"></i>
              </button>
            </div>
          </div>
          <div className="">
            <button
              className="scroll_top rounded-circle  px-2 py-1  border-0 shadow-lg"
              id="scroll_top"
              onClick={scrollToTop}
            >
              <i className="fas fa-arrow-up fa-2x text-white"></i>
            </button>
          </div>

          <div className="container-fluid tab-content " id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-section1"
              role="tabpanel"
              aria-labelledby="section1"
            >
              <div className="fs-5 fw-bold text-center py-2 ">Section 1</div>

              {/* {(section1_ans)?
            <Quiz_answer func={pull_data}/>:
            <>
            completedtm
            <button onClick={(e) => {move_next_page(e)}} id="1">next page</button>
            </>} */}

              <Quiz_answer
                score={score}
                handle={handle}
                question_count={state.question_count}
                score_id={state.score_id}
              />
              <div className="d-flex justify-content-center my-1">
                <button
                  className="btn btn-primary curved_btn my-2"
                  onClick={(e) => {
                    move_next_page(e);
                  }}
                  id="1"
                  style={{ display: "none" }}
                >
                  Next page
                  <i className="fad fa-arrow-right m-2"></i>
                </button>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-section2"
              role="tabpanel"
              aria-labelledby="section2"
            >
              <div className="fs-5 fw-bold text-center py-2 ">Section 2</div>
              <Quiz_answer
                score={score}
                handle={handle}
                question_count={state.question_count}
                score_id={state.score_id}
              />
              <div className="d-flex justify-content-center my-1">
                <button
                  className="btn btn-primary curved_btn my-2"
                  onClick={(e) => {
                    move_next_page(e);
                  }}
                  id="2"
                  // disabled
                  style={{ display: "none" }}
                >
                  Next page
                  <i className="fad fa-arrow-right m-2"></i>
                </button>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-section3"
              role="tabpanel"
              aria-labelledby="section3"
            >
              <div className="fs-5 fw-bold text-center py-2 ">Section 3</div>
              <Quiz_answer
                score={score}
                handle={handle}
                question_count={state.question_count}
                score_id={state.score_id}
              />
              <div className="d-flex justify-content-center my-1">
                <button
                  className="btn btn-primary curved_btn my-2"
                  onClick={(e) => {
                    move_next_page(e);
                  }}
                  id="3"
                  // disabled
                  style={{ display: "none" }}
                >
                  Next page
                  <i className="fad fa-arrow-right m-2"></i>
                </button>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-section4"
              role="tabpanel"
              aria-labelledby="section4"
            >
              <div className="fs-5 fw-bold text-center py-2 ">Section 4</div>
              <Quiz_answer
                score={score}
                handle={handle}
                question_count={state.question_count}
                score_id={state.score_id}
              />
              <div className="d-flex justify-content-center my-1">
                <button
                  className="btn btn-primary curved_btn my-2"
                  onClick={(e) => {
                    section4_btn();
                  }}
                  id="4"
                  // disabled
                  style={{ display: "none" }}
                >
                  End Quiz
                  <i className="fad fa-arrow-right m-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Timeline;
