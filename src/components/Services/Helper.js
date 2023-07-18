import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/";
// const API_URL = "https://laravel-react-quiz.onweb.im/public/api/";
const API_URL = "https://llklk.cu.ma/public/api/";

const token = `Bearer ${sessionStorage.getItem("token")}`;

const auth = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
};

const bearer_auth = {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
};

const fileupload_auth = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
};

const helpers = {
  register: function (data) {
    return axios.post(API_URL + "register", data);
  },

  get_quiz_questions: function (question_count) {
    return axios.get(API_URL + `get_quiz_questions/${question_count}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  logout: function (value, question_count) {
    console.log("value:", value, question_count);
    return axios.get(API_URL + `logout/${value}/${question_count}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  export_bulkupload_format: function () {
    return axios({
      url: API_URL + "downloadAction",
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  importExportView: function () {
    return axios.get(API_URL + "importExportView", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  question_count: async function () {
    // return await axios.get(API_URL + "question_count");
    try {
      const response = await axios.get(API_URL + "question_count");
      return response;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  },

  import: function (formData) {
    return axios.post(API_URL + "import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  export_questions: function () {
    return axios({
      url: API_URL + "export",
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  final_result: async function (data) {
    return await axios.post(API_URL + "final_result", data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  get_final_result: async function (data) {
    return await axios.post(API_URL + "get_final_result", data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },

  delete_questions: function () {
    return axios.delete(API_URL + "delete_questions", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  },
};

export default helpers;
