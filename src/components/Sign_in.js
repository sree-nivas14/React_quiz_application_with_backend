import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sign_in.css";
import { useNavigate } from "react-router-dom";
import helpers from "./Services/Helper";
import axios from "axios";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { Formik } from "formik";
import * as Yup from "yup";

function Sign_in() {
  const [username, setUsername] = useState();
  const [mail, setMail] = useState();
  const [password, setpassword] = useState();
  const [question_count, setQuestion_count] = useState(4);
  const [timer, setTimer] = useState(1);
  const navigate = useNavigate();

  async function model_submit() {
    let pattern = /^[+]?[1-9]\d*?[0]*$/;
    let question_count = document.getElementById("question_count").value;
    let timer = document.getElementById("duration").value;
    // console.log(question_count, timer);

    if (question_count == "" && timer == "") {
      toast("Pls fill the question count and timer fields in settings tab", {
        type: "error",
      });
      return false;
    } else if (!pattern.test(question_count) || !pattern.test(timer)) {
      toast("Pls provide positive non-zero value", {
        type: "error",
      });
      setQuestion_count("");
      setTimer("");
      return false;
    } else {
      var response = await helpers.question_count();
      if (response.data != 0) {
        if (question_count <= response.data) {
          return true;
        } else {
          toast(
            `The total number of uploaded question is ${response.data}. So, you must need to provide the question count is lesser than or equal to the total number of uploaded question.`,
            {
              type: "error",
            }
          );
          setQuestion_count("");
          setTimer("");
          return false;
        }
      } else {
        toast("Questions not found. Please upload questions from admin.", {
          type: "error",
        });
      }
    }
  }

  async function handle_click(e) {
    document.getElementById("fp-container").style.visibility = "visible";

    e.preventDefault();
    var is_chk = "";
    if (
      // username == "superadmin" &&
      password == "superadmin@123" &&
      mail == "superadmin@gmail.com"
    ) {
      is_chk = true;
    } else {
      is_chk = await model_submit();
      // console.log(is_chk);
    }
    if (is_chk) {
      if (!username == "" && !password == "" && !mail == "") {
        var data = {
          name: username,
          email: mail,
          password: password,
          google_id: "",
        };

        helpers
          .register(data)
          .then(function (response) {
            document.getElementById("fp-container").style.visibility = "hidden";

            // console.log(response);
            window.sessionStorage.setItem("username", username);
            window.sessionStorage.setItem(
              "token",
              response.data.token.accessToken
            );

            if (response.data.loggined_user.is_admin == "1") {
              navigate("/admin", {
                state: {
                  score_id: response.data.score_id,
                },
              });
            } else {
              navigate("/timeline", {
                state: {
                  username: username,
                  question_count: question_count,
                  timer: timer,
                  score_id: response.data.score_id,
                },
              });
            }
          })
          .catch(function (error) {
            alert(error.message);
          });
        // navigate("/logout");
      } else {
        document.getElementById("fp-container").style.visibility = "hidden";
        toast("Pls fill all the fields", { type: "error" });
      }
    }
  }

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Name is a required field")
      .matches(/^[a-zA-Z ]*$/, "Must be only Alphabets"),
    email: Yup.string()
      .required("Email is a required field")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is a required field")
      .min(4, "Must be at least 8 characters"),
  });

  return (
    <div className="sign_in_bg_image">
      <ToastContainer position="top-right" theme="dark" />
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn btn-light border border-2 border-dark"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        style={{ borderRadius: "8px 0px 0px 8px", float: "right" }}
      >
        <i className="fa-solid fa-gear fa-1x settings_icon"></i>
      </button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Settings
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="">
                <div>
                  <label className="control-label mt-0">
                    How many questions do you need in each section of this quiz?
                    <span className="text-danger"> *</span>
                  </label>
                </div>
                <div>
                  <input
                    className="form-control "
                    type="number"
                    placeholder="Enter no of Questions for each section"
                    name="question_count"
                    id="question_count"
                    value={question_count}
                    onChange={(e) => {
                      setQuestion_count(e.target.value);
                    }}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    required
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <label className="control-label ">
                    Set timer for this quiz :
                    <span className="text-danger">(in minutes) *</span>
                  </label>
                </div>
                <div>
                  <input
                    className="form-control "
                    type="number"
                    placeholder="Enter timings"
                    name="timer"
                    id="duration"
                    value={timer}
                    onChange={(e) => {
                      setTimer(e.target.value);
                    }}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  model_submit();
                }}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="background ">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <Formik
          validationSchema={schema}
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={async (values) => {
            document.getElementById("fp-container").style.visibility =
              "visible";

            // e.preventDefault();
            var is_chk = "";
            if (
              // username == "superadmin" &&
              password == "superadmin@123" &&
              mail == "superadmin@gmail.com"
            ) {
              is_chk = true;
            } else {
              is_chk = await model_submit();
              // console.log(is_chk);
            }
            if (is_chk) {
              if (!username == "" && !password == "" && !mail == "") {
                var data = {
                  name: username,
                  email: mail,
                  password: password,
                  google_id: "",
                };

                helpers
                  .register(data)
                  .then(function (response) {
                    document.getElementById("fp-container").style.visibility =
                      "hidden";

                    // console.log(response);
                    window.sessionStorage.setItem("username", username);
                    window.sessionStorage.setItem(
                      "token",
                      response.data.token.accessToken
                    );

                    if (response.data.loggined_user.is_admin == "1") {
                      navigate("/admin", {
                        state: {
                          score_id: response.data.score_id,
                        },
                      });
                    } else {
                      navigate("/timeline", {
                        state: {
                          username: username,
                          question_count: question_count,
                          timer: timer,
                          score_id: response.data.score_id,
                        },
                      });
                    }
                  })
                  .catch(function (error) {
                    alert(error.message);
                  });
                // navigate("/logout");
              } else {
                document.getElementById("fp-container").style.visibility =
                  "hidden";
                toast("Pls fill all the fields", { type: "error" });
              }
            }
            // }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form
              className="form overflow-hidden"
              noValidate
              onSubmit={handleSubmit}
            >
              <h3>Login Here</h3>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Full Name"
                id="name"
                name="name"
                className="input"
                // onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                onChange={(e) => {
                  setUsername(e.target.value);
                  handleChange(e);
                }}
                // required
              />
              <p className="error text-danger">
                {errors.name && touched.name && errors.name}
              </p>
              <label htmlFor="username">Mail ID</label>
              <input
                className="input"
                onChange={(e) => {
                  setMail(e.target.value);
                  handleChange(e);
                }}
                type="email"
                name="email"
                // onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter email id"
                id="email"
              />
              {/* If validation is not passed show errors */}
              <p className="error text-danger">
                {errors.email && touched.email && errors.email}
              </p>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                className="input"
                value={values.password}
                // onChange={handleChange}
                onChange={(e) => {
                  setpassword(e.target.value);
                  handleChange(e);
                }}
                onBlur={handleBlur}
              />
              <p className="error text-danger">
                {errors.password && touched.password && errors.password}
              </p>
              <button
                className="button"
                type="submit"
                // onClick={(e) => {
                //   handle_click(e);
                // }}
              >
                Log In
              </button>
              <div class="or-container">
                <div class="line-separator"></div>{" "}
                <div class="or-label">or</div>
                <div class="line-separator"></div>
              </div>
              <div>
                <LoginSocialGoogle
                  client_id={
                    "349026888305-868mtsb0epjci5ligen43m9l5jaccjh5.apps.googleusercontent.com"
                  }
                  scope="openid profile email"
                  discoveryDocs="claims_supported"
                  access_type="offline"
                  onResolve={async ({ provider, data }) => {
                    document.getElementById("fp-container").style.visibility =
                      "visible";

                    // console.log(provider, data);
                    var is_chk = await model_submit();
                    let question_count =
                      document.getElementById("question_count").value;
                    let timer = document.getElementById("duration").value;
                    if (is_chk) {
                      var values = {
                        name: data.name,
                        email: data.email,
                        password: "",
                        google_id: data.sub,
                      };
                      // axios
                      //   .post("https://llklk.cu.ma/public/api/register", values, {
                      //     headers: {
                      //       "Access-Control-Allow-Origin": "*",
                      //       "Content-Type": "application/json",
                      //     },
                      //   })
                      helpers
                        .register(values)
                        .then(function (response) {
                          document.getElementById(
                            "fp-container"
                          ).style.visibility = "hidden";

                          window.sessionStorage.setItem("username", data.name);
                          window.sessionStorage.setItem(
                            "token",
                            response.data.token.accessToken
                          );

                          navigate("/timeline", {
                            state: {
                              username: data.name,
                              question_count: question_count,
                              timer: timer,
                              score_id: response.data.score_id,
                            },
                          });
                        })
                        .catch(function (error) {
                          document.getElementById(
                            "fp-container"
                          ).style.visibility = "hidden";

                          alert(error.message);
                        });
                    }
                  }}
                  onReject={(err) => {
                    document.getElementById("fp-container").style.visibility =
                      "hidden";

                    alert("err:", err);
                  }}
                >
                  <GoogleLoginButton>
                    <strong>
                      <span className="text-dark login_text">
                        Log In With Google
                      </span>
                    </strong>
                  </GoogleLoginButton>
                </LoginSocialGoogle>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <div
        className="fp-container"
        id="fp-container"
        style={{ visibility: "hidden" }}
      >
        <i
          className="fas fa-spinner fa-pulse fp-loader"
          style={{ fontSize: "70px", float: "center" }}
        ></i>
      </div>
    </div>
  );
}
export default Sign_in;
