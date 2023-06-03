import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import helpers from "../Services/Helper";
import { useLocation } from "react-router-dom";
import "./Admin_page.css";
import Basic_table from "../data_table/Basic_table";
import Result_table from "../data_table/Result_table";
import "../Quiz_answer.css";

function Admin_page() {
  const [uploadedfile, setuploadedfile] = useState();
  const [questions, setquestions] = useState([]);
  const [email, setemail] = useState();
  const [result, setresult] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();

  const body = document.querySelector("body"),
    sidebar = body.querySelector("nav"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

  useEffect(() => {
    //automatic sidebar toggle
    if (window.innerWidth <= 550) {
      var element = document.getElementById("sidebar");
      element.classList.add("close");
    }
    // axios
    //   .get("http://127.0.0.1:8000/api/importExportView", {
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    //     },
    //   })
    helpers
      .importExportView()
      .then(function (response) {
        console.log(response);
        if (response.status == 200) {
          document.getElementById("fp-container").style.visibility = "hidden";
          setquestions(response.data);
        }
      })
      .catch(function (error) {
        document.getElementById("fp-container").style.visibility = "hidden";
        // console.log(error);
        alert(error.response.data.message);
      });
  }, []);

  function toggle_icon() {
    sidebar.classList.toggle("close");
  }

  const onDropAccepted = (acceptedFiles) => {
    document.getElementById("fp-container").style.visibility = "visible";
    console.log(acceptedFiles[0]);
    let formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    // axios
    //   .post("http://127.0.0.1:8000/api/import", formData, {
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Content-Type": "multipart/form-data",
    //       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    //     },
    //   })
    helpers
      .import(formData)
      .then(function (response) {
        console.log(response);
        if (response.status == 200) {
          document.getElementById("fp-container").style.visibility = "hidden";
          $(".alert-success")
            .fadeTo(5000, 500)
            .slideUp(500, function () {
              $(".alert-success").slideUp(500);
            });
          setuploadedfile(acceptedFiles[0].path);
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        document.getElementById("fp-container").style.visibility = "hidden";
        alert(error.response.data.message);
      });
  };
  const onDropRejected = (rejectedFiles) => {
    console.log(rejectedFiles);
    rejectedFiles.map(({ file, errors }) => {
      {
        errors.map((e) => {
          toast(e.message, { type: "error" });
        });
      }
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/*": [".xlsx"],
      // "image/jpeg": [],
      // "image/png": [],
    },
    onDropAccepted,
    onDropRejected,
    multiple: false,
  });

  function log_out() {
    let text = "Are u sure want to log out?";
    if (window.confirm(text) == true) {
      helpers
        .logout(state.score_id)
        .then((response) => {
          toast(response, { type: "error" });
          sessionStorage.clear();
          navigate("/");
        })
        .catch(function (error) {
          alert(error.response.data.message);
        });
    }
  }

  function search_Result() {
    if (email) {
      document.getElementById("fp-container").style.visibility = "visible";
      var formData = new FormData();
      formData.append("name", email);
      helpers
        .get_final_result(formData)
        .then((response) => {
          document.getElementById("fp-container").style.visibility = "hidden";
          setresult(response.data);
        })
        .catch(function (error) {
          document.getElementById("fp-container").style.visibility = "hidden";

          alert(error.response.data.message);
        });
    } else {
      console.log(document.getElementById("fp-container"));
      document.getElementById("fp-container").style.visibility = "visible";

      toast("Pls fill the mandatory fields", { type: "error" });
    }
  }

  function format_download() {
    document.getElementById("fp-container").style.visibility = "visible";
    helpers
      .export_bulkupload_format()
      .then((response) => {
        document.getElementById("fp-container").style.visibility = "hidden";
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Questions_Bulk_upload_format.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        toast("Bulk Upload format has been downloaded successfully", {
          type: "success",
        });
      })
      .catch(function (error) {
        document.getElementById("fp-container").style.visibility = "hidden";
        alert(error.response.data.message);
      });
  }

  return (
    <div>
      <nav className="sidebar" id="sidebar">
        <header>
          <div className="image-text">
            <div className="logo-text mt-3">
              <span className="name fw-bold p-3 fs-3">Admin Panel</span>
            </div>
          </div>

          <i
            className="fa-solid fa-chevron-right toggle"
            onClick={toggle_icon}
          ></i>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links p-0">
              <div
                className="nav flex-column nav-pills"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
                style={{ display: "inline-block !important" }}
              >
                <button
                  className="nav-link active btn ps-1"
                  id="v-pills-ques_settings-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-ques_settings"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-ques_settings"
                  aria-selected="true"
                >
                  <span className="d-flex justify-content-start align-items-center">
                    <i className="fa-solid fa-arrow-up-from-bracket icon px-1 ps-3"></i>
                    <span className="text nav-text text-wrap text-start ps-4">
                      Questions Settings
                    </span>
                  </span>
                </button>
                <button
                  className="nav-link btn ps-1 my-3"
                  id="v-pills-user_result-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-user_result"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-user_result"
                  aria-selected="false"
                >
                  <span className="d-flex justify-content-start align-items-center">
                    <i className="fa-solid fa-square-poll-horizontal icon  px-1 ps-3"></i>
                    <span className="text nav-text ps-4">User Result</span>
                  </span>
                </button>
              </div>
            </ul>
          </div>

          <div className="bottom-content">
            <button
              className="nav-link btn ps-1"
              // id="v-pills-settings-tab"
              // data-bs-toggle="pill"
              // data-bs-target="#v-pills-settings"
              type="button"
              // role="tab"
              // aria-controls="v-pills-settings"
              // aria-selected="false"
              onClick={log_out}
            >
              <span className="d-flex justify-content-start align-items-center">
                <i className="fa-solid fa-right-from-bracket icon px-1 ps-3"></i>
                <span className="text nav-text ps-4">Logout</span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      <section className="main-display">
        <ToastContainer position="top-right" theme="dark" />
        <div className="tab-content" id="v-pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="v-pills-ques_settings"
            role="tabpanel"
            aria-labelledby="v-pills-ques_settings-tab"
          >
            <h1 class="ps-5 py-3" style={{ background: "rgb(203 213 244)" }}>
              Questions Settings
            </h1>
            <div className="container col-md-11">
              <div
                class="alert alert-success"
                role="alert"
                style={{ display: "none", fontWeight: "600" }}
              >
                <i class="fa-regular fa-circle-check fw-bold text-success px-2"></i>
                {uploadedfile} has been Successfully Uploaded
              </div>

              <section className="container my-5">
                {/* <a
                  href="https://llklk.cu.ma/public/api/downloadAction"
                  style={{ textDecoration: "none" }}
                > */}
                <i
                  class="fa-solid fa-file-arrow-down bulk_upload_format text-dark"
                  title="Bulk Upload Format"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  onClick={format_download}
                ></i>
                {/* </a> */}
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} type="file" />
                  <i class="fa-solid fa-cloud-arrow-up fa-3x my-2"></i>
                  <h6>
                    Drag 'n' drop some files here, or click to select files
                  </h6>
                  <em>(Only *.xlsx files will be accepted)</em>
                </div>
                {/* <aside>
                  <h4>Accepted files</h4>
                  <ul>{acceptedFileItems}</ul>
                  <h4>Rejected files</h4>
                  <ul>{fileRejectionItems}</ul>
                </aside> */}
              </section>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="">Uploaded Question & Answers</h5>
                {/* <div>
                  <a
                    href="http://127.0.0.1:8000/api/export"
                    className="btn btn-primary"
                  >
                    Export
                  </a>
                </div> */}
              </div>
              {/* <div className="table-responsive">
                <table className="table  table-bordered border-dark ">
                  <thead>
                    <tr>
                      <th scope="col">S.no</th>
                      <th scope="col">Question</th>
                      <th scope="col">Options</th>
                      <th scope="col">Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((listValue, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{listValue.question}</td>
                          <td>{listValue.option}</td>
                          <td>{listValue.correct_answer}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div> */}
              <Basic_table questions={questions} />
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="v-pills-user_result"
            role="tabpanel"
            aria-labelledby="v-pills-user_result-tab"
          >
            <h1 class="ps-5 py-3" style={{ background: "rgb(203 213 244)" }}>
              User Results
            </h1>
            <div className="container">
              <div className="row bg-white px-2 py-5 m-3 rounded ">
                <div className="col-md-4 align-items-center">
                  {/* <label className="control-label">Email *</label> */}
                  Email <span className="text-danger">*</span>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => setemail(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-primary mt-4"
                    type="submit"
                    onClick={search_Result}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="bg-white p-2 m-3 rounded">
                <Result_table questions={result} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="fp-container"
        id="fp-container"
        style={{ visibility: "hidden" }}
      >
        <i
          className="fas fa-spinner fa-pulse fp-loader"
          style={{ fontSize: "70px" }}
        ></i>
      </div>
    </div>
  );
}

export default Admin_page;
