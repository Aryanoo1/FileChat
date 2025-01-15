import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Interface from "../components/Interface";
import Dashboard from "../components/Dashboard";
import Registeration from "../components/Registeration";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registeration />} />
        <Route path="/home" element={<Dashboard />} />
      </Routes>
      <Routes>
        <Route path="/chats" element={<Interface />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
