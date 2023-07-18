import React, { useState, useEffect } from "react";
import axios from "axios";
import helpers from "./Services/Helper";
import "./Quiz_answer.css";
import $ from "jquery";
import pic from "./crying_emoji-removebg-preview.png";

function Quiz_answer({ score, handle, question_count, score_id }) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState([]);
  const [processedAnswers, setProcessedAnswers] = useState([]);
  const [question_len, setQuestion_len] = useState(0);
  const [checked_ques, setChecked_ques] = useState(0);

  const [quiz_start, setQuiz_start] = useState(false);

  const [QuizData, setQuizData] = useState([]);

  const fetchQuizData = async () => {
    document.getElementById("fp-container").style.visibility = "visible";
    // axios
    //   .get("http://127.0.0.1:8000/api/get_quiz_questions", {
    //     headers: {
    //       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    //     },
    //   })
    helpers
      .get_quiz_questions(question_count)
      .then((response) => {
        console.log(response.data);
        const formattedCategory = response.data.results.map((cat) => {
          document.getElementById("fp-container").style.visibility = "hidden";
          const incorrectAnswersIndexes = cat.incorrect_answers.length;
          const randomIndex = Math.round(
            Math.random() * (incorrectAnswersIndexes - 0) + 0
          );

          cat.incorrect_answers.splice(randomIndex, 0, cat.correct_answer);

          return {
            ...cat,
            answers: cat.incorrect_answers,
          };
        });
        // console.log(formattedCategory);
        setQuestion_len(formattedCategory.length);
        setQuizData(formattedCategory);
      })
      .catch(function (error) {
        document.getElementById("fp-container").style.visibility = "visible";
        console.log(error.response);
        alert(error.response.data.message);
      });
    return false;

    try {
      const url = `https://opentdb.com/api.php?amount=${question_count}&category=9&difficulty=easy`;
      // const url = "http://127.0.0.1:8000/api/get_quiz_questions";
      const { data } = await axios.get(url);
      // console.log("calling");
      console.log("data", data);

      const formattedCategory = data.results.map((cat) => {
        document.getElementById("fp-container").style.visibility = "hidden";
        const incorrectAnswersIndexes = cat.incorrect_answers.length;
        const randomIndex = Math.round(
          Math.random() * (incorrectAnswersIndexes - 0) + 0
        );

        cat.incorrect_answers.splice(randomIndex, 0, cat.correct_answer);

        return {
          ...cat,
          answers: cat.incorrect_answers,
        };
      });
      // console.log(formattedCategory);
      setQuestion_len(formattedCategory.length);
      setQuizData(formattedCategory);
    } catch (error) {
      document.getElementById("fp-container").style.visibility = "visible";

      // alert("Something went wrong");
      // window.location.reload();
      console.log("Fetch quiz error =====>>>>", error);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  const handleAnswerChange = (e, selectedQuestion, i) => {
    e.preventDefault();
    const { value } = e.target;
    // console.log(value, selectedQuestion, i);
    document.getElementById("question_no" + (i + 1)).style.backgroundColor =
      "green";
    document.getElementById("question_no" + (i + 1)).style.color = "white";

    const isExistQuestion =
      selectedAnswers.length &&
      selectedAnswers.find((answer) => answer.question === selectedQuestion);
    // console.log(selectedAnswers);

    if (isExistQuestion && isExistQuestion.answer) {
      const updatedAnswers = selectedAnswers.map((answer) => {
        if (answer.question === selectedQuestion) {
          return { question: selectedQuestion, answer: value };
        }
        return answer;
      });
      setSelectedAnswers(updatedAnswers);
      console.log("updated anwser:", updatedAnswers);
    } else {
      setSelectedAnswers([
        ...selectedAnswers,
        { question: selectedQuestion, answer: value },
      ]);
      // console.log(selectedAnswers);
    }
  };

  useEffect(() => {
    setChecked_ques(selectedAnswers.length);
  }, [selectedAnswers]);

  const relatedAnswer = (question, selectedAnswers) => {
    console.log(question, selectedAnswers);
    if (selectedAnswers && selectedAnswers.length) {
      const relatedQuestion = selectedAnswers.find(
        (answer) => answer.question === question
      );
      return (relatedQuestion && relatedQuestion.answer) || "";
    }
    return "";
  };

  function handleResult(e) {
    e.preventDefault();
    console.log(selectedAnswers);
    setShowAnswers(selectedAnswers);
    const processedAnswers = selectedAnswers.map(({ answer, question }) => {
      const relatedQuestion = QuizData.find(
        (category) => category.question === question
      );
      if (relatedQuestion.correct_answer === answer) {
        return { correctAnswer: answer, isCorrect: true, question };
      }
      return {
        correctAnswer: relatedQuestion.correct_answer,
        wrongAnswer: answer,
        isCorrect: false,
        question,
      };
    });

    setProcessedAnswers(processedAnswers);
    console.log(processedAnswers);
    const crt_answers = processedAnswers.filter(
      ({ isCorrect }) => isCorrect
    ).length;

    //it show correct answer count
    // alert(
    //   processedAnswers.filter(({ isCorrect }) => isCorrect).length +
    //     " out of " +
    //     processedAnswers.length
    // );
    score(crt_answers);
    final_result(crt_answers, processedAnswers);

    document.getElementById("modal_close_btn").click();
    // props.func(selectedAnswers);
    setQuiz_start(true);
    setQuizData([]);
    setSelectedAnswers([]);
  }

  //stored all the final data in scores table
  function final_result(crt_answers, processedAnswers) {
    var activeTab = $(".nav-pills").find(".active");
    var id = activeTab.attr("id");
    var total_section_score = {
      data: {
        sec: id,
        score_id: score_id,
      },
      values: {
        score: crt_answers,
        questions: selectedAnswers.length + "/" + question_len,
        question_length: question_len,
        total_question: question_count,
        processed_answers: processedAnswers,
      },
    };
    console.log("total_section_score:", total_section_score);
    helpers
      .final_result(total_section_score)
      .then(function (response) {
        console.log(response);
      })

      .catch(function (error) {
        alert(error.message);
      });
  }

  function question_scroll_top(e) {
    // alert(e.target.id);
    var get_qn_id = e.target.id.match(/(\d+)/);
    document.getElementById("question_" + get_qn_id[0]).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  return (
    <div className="">
      {!quiz_start ? (
        <>
          <div className="row border border-2 border-light">
            <div
              className="col-2 d-flex justify-content-center bg-color"
              style={{ borderRadius: "15px" }}
            >
              <div
                className="border border-2 border-grey rounded bg-color"
                style={{ position: "fixed" }}
              >
                <div className="fs-6">
                  <h6 className="border border-2 border-grey rounded bg-white m-1 px-1 result_tab">
                    Total No Of Questions : {question_len}
                  </h6>
                  <h6 className="border border-2 border-grey rounded bg-white m-1 px-1 result_tab">
                    Answered Questions : {checked_ques}
                  </h6>
                  <h6 className="border border-2 border-grey rounded bg-white m-1 px-1 result_tab">
                    Unanswered Questions :{question_len - checked_ques}
                  </h6>
                </div>

                <div
                  className="overflow-auto border border-2 border-grey m-1 rounded question_count_tab bg-white text-center"
                  style={{ maxHeight: "200px" }}
                >
                  {QuizData.map((quiz, i) => (
                    <div
                      className="dot m-1 user-select-none contain"
                      style={{ cursor: "pointer" }}
                      id={"question_no" + (i + 1)}
                      onClick={(e) => {
                        question_scroll_top(e);
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-10">
              <div>
                <form>
                  <div className="card border-0">
                    <div
                      className="card-body bg-color p-0 contain"
                      style={{ borderRadius: "15px" }}
                    >
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
                      {QuizData.map((quiz, i) => (
                        <div
                          className="m-3 pt-3 ps-3 pe-3 card_bg"
                          style={{ borderRadius: "20px" }}
                        >
                          <ul className="list-unstyled">
                            <li className="" style={{ fontWeight: "500" }}>
                              <span
                                className="fw-bolder pe-2"
                                id={"question_" + (i + 1)}
                                style={{ scrollMarginTop: "6rem" }}
                              >
                                {i + 1}.
                              </span>
                              {quiz.question}
                            </li>
                          </ul>

                          <ul
                            className="nav nav-pills "
                            id="pills-tab"
                            role="tablist"
                          >
                            <li
                              className="nav-item  mx-3 options main_cards details_cards_options"
                              role="presentation"
                            >
                              {quiz.answers.map((ans) => (
                                <>
                                  {/* <div className=" border border-2"> */}
                                  <button
                                    className="nav-link option "
                                    type="button"
                                    id="pills-home-tab"
                                    data-bs-toggle="pill"
                                    value={ans}
                                    style={{ wordBreak: "break-word" }}
                                    onClick={(e) =>
                                      handleAnswerChange(e, quiz.question, i)
                                    }
                                  >
                                    {ans}
                                  </button>
                                  {/* </div> */}
                                  {/* <span className=" border border-2">
                                  <button
                                    className="nav-link option"
                                    type="button"
                                    id="pills-home-tab"
                                    data-bs-toggle="pill"
                                    value={ans}
                                    onClick={(e) =>
                                      handleAnswerChange(e, quiz.question)
                                    }
                                  >
                                    {ans}
                                  </button>
                                </span> */}
                                </>
                              ))}
                            </li>
                          </ul>
                          <br />
                        </div>
                      ))}
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-success my-3 curved_btn"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Do u want to submit the data?
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          id="modal_close_btn"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div>Total No Of Questions : {question_len}</div>
                        <div>Answered Questions : {checked_ques}</div>
                        <div>
                          Unanswered Questions :{question_len - checked_ques}
                        </div>

                        {question_len == question_len - checked_ques ? (
                          <h6 className="text-danger">
                            <hr />
                            Note: You didn't choose anything from this
                            section.If you want to move another section, you
                            can't attend this section again.
                          </h6>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary curved_btn"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary curved_btn"
                          onClick={(e) => {
                            handleResult(e);
                            handle();
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="">
          <div className="card card_bg">
            <div className="card-body">
              {processedAnswers.length == 0 ? (
                <>
                  <img
                    src={pic}
                    width="200"
                    height="200"
                    className="rounded mx-auto d-block"
                  />
                  <h3 className="text-center">You didn't choose anything!!</h3>
                </>
              ) : (
                <>
                  <h5>
                    Your Selected Answers{" "}
                    <span
                      class="badge rounded-pill bg-dark"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Attended question count"
                    >
                      {showAnswers.length}/{question_len}
                    </span>
                    :
                  </h5>

                  <div className="main_cards">
                    {showAnswers.map((e, i) => (
                      // <div className="col-md-6 border border-2 shadow rounded my-2 py-2 answer_data text-dark ">
                      // <ul className="list-unstyled px-3">
                      // <li className="" style={{ fontWeight: "500" }}>
                      <div className="details_cards">
                        <div>
                          {i + 1}. {e.question}
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn btn-success mt-2 mx-2 py-2 selected_options text-wrap"
                          >
                            {e.answer}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz_answer;
