import React from "react";
import "./Test_sign.css";

function Test_sign() {
  const form = document.getElementsByTagName("form");
  var eField = form.getElementsByClassName(".email");
  var eInput = eField.getElementsByTagName("input");
  var pField = form.getElementsByClassName(".password");
  var pInput = pField.getElementsByTagName("input");

  form.onsubmit = (e) => {
    e.preventDefault(); //preventing from form submitting
    //if email and password is blank then add shake class in it else call specified function
    eInput.value == "" ? eField.classList.add("shake", "error") : checkEmail();
    pInput.value == "" ? pField.classList.add("shake", "error") : checkPass();

    setTimeout(() => {
      //remove shake class after 500ms
      eField.classList.remove("shake");
      pField.classList.remove("shake");
    }, 500);

    eInput.onkeyup = () => {
      checkEmail();
    }; //calling checkEmail function on email input keyup
    pInput.onkeyup = () => {
      checkPass();
    }; //calling checkPassword function on pass input keyup

    function checkEmail() {
      //checkEmail function
      let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //pattern for validate email
      if (!eInput.value.match(pattern)) {
        //if pattern not matched then add error and remove valid class
        eField.classList.add("error");
        eField.classList.remove("valid");
        let errorTxt = eField.querySelector(".error-txt");
        //if email value is not empty then show please enter valid email else show Email can't be blank
        eInput.value != ""
          ? (errorTxt.innerText = "Enter a valid email address")
          : (errorTxt.innerText = "Email can't be blank");
      } else {
        //if pattern matched then remove error and add valid class
        eField.classList.remove("error");
        eField.classList.add("valid");
      }
    }

    function checkPass() {
      //checkPass function
      if (pInput.value == "") {
        //if pass is empty then add error and remove valid class
        pField.classList.add("error");
        pField.classList.remove("valid");
      } else {
        //if pass is empty then remove error and add valid class
        pField.classList.remove("error");
        pField.classList.add("valid");
      }
    }

    //if eField and pField doesn't contains error class that mean user filled details properly
    if (
      !eField.classList.contains("error") &&
      !pField.classList.contains("error")
    ) {
      window.location.href = form.getAttribute("action"); //redirecting user to the specified url which is inside action attribute of form tag
    }
  };
  return (
    <div>
      {" "}
      <div class="wrapper">
        <header>Login Form</header>
        <form action="#">
          <div class="field email">
            <div class="input-area">
              <input type="text" placeholder="Email Address" />
              <i class="icon fas fa-envelope"></i>
              <i class="error error-icon fas fa-exclamation-circle"></i>
            </div>
            <div class="error error-txt">Email can't be blank</div>
          </div>
          <div class="field password">
            <div class="input-area">
              <input type="password" placeholder="Password" />
              <i class="icon fas fa-lock"></i>
              <i class="error error-icon fas fa-exclamation-circle"></i>
            </div>
            <div class="error error-txt">Password can't be blank</div>
          </div>
          <div class="pass-txt">
            <a href="#">Forgot password?</a>
          </div>
          <input type="submit" value="Login" />
        </form>
        <div class="sign-txt">
          Not yet member? <a href="#">Signup now</a>
        </div>
      </div>
    </div>
  );
}

export default Test_sign;
