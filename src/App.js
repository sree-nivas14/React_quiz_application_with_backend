import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
// import Sign_in from "./components/Sign_in";
import Sign_in from "./components/Sign_in";
import Timeline from "./components/Timeline";
import Logout from "./components/Logout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Page_not_found from "./components/Page_not_found";
import Admin_page from "./components/admin_page/Admin_page";
import Basic_table from "./components/data_table/Basic_table";

function App() {
  // const [logged_in, setLoggedIn] = useState();
  // useEffect(() => {
  //   var loggin_details = localStorage.getItem("username");
  //   var logged_in = loggin_details ? true : false;
  //   setLoggedIn(logged_in);
  //   // console.log(logged_in);
  // }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sign_in />} />
          <Route
            path="/React_quiz_application_with_backend"
            element={<Sign_in />}
          />
          <Route element={<ProtectedRoutes />}>
            <Route path="/data_table" element={<Basic_table />} />
            <Route path="/admin" element={<Admin_page />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="*" element={<Page_not_found />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
