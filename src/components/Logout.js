import React, { useState, useEffect } from "react";
import "./Quiz_answer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Sign_in.css";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

function Logout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  function back_to_login() {
    navigate("/");
    sessionStorage.clear();
  }

  return (
    <div className="sign_in_bg_image text-white">
      {/* {state >= 2 ? (
        <>
          <Confetti width={width} height={height} />
        </>
      ) : (
        ""
      )} */}
      {/* <div className="row justify-content-center">
        <div className="col-md-6 border border-2 border-light"> */}
      <div className=" scoring_board  border-0 p-1 w-50">
        {/* <div className="d-flex justify-content-center"> */}
        <i class="fa-4x bg-white text-success rounded-pill fa-solid fa-circle-check tick"></i>
        {/* </div> */}
        <h5 className="text-center mt-5">
          Thank you {window.sessionStorage.getItem("username")} for attending
          the Quiz.
        </h5>
        <div className="card-body text-center">
          <h3 className="text-center">Your score is {state ?? "0"}</h3>
          <button className="logout_button" onClick={back_to_login}>
            Back to Login
          </button>
        </div>
        {/* </div>
        </div> */}
      </div>
      {/* <div className="scoring_board p-2"> */}
      {/*   <div className="card bg-transparent border-0 ">
        </div>*/}
      {/* </div> */}
    </div>
  );
}

export default Logout;
