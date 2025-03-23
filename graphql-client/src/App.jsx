import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import UpdateProjectStatus from "./pages/UpdateProjectStatus";
import NavBar from "./components/Navbar";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute>
              <Teams />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <PrivateRoute>
              <TeamDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <PrivateRoute>
              <ProjectDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId/update"
          element={
            <PrivateRoute>
              <UpdateProjectStatus />
            </PrivateRoute>
          }
        />
        {/* Fallback to login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
