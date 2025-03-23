import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { gql, useMutation } from "@apollo/client";
import { client } from "../main";

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

function NavBar() {
  const { authUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [logout] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      await client.resetStore();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4" style={{ width: "700px" }}>
      <Container>
        <Navbar.Brand as={NavLink} to="/dashboard">
          My Project Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="me-auto">
            {!authUser && (
              <Nav.Link as={NavLink} to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Login
              </Nav.Link>
            )}
            {authUser && (
              <>
                <Nav.Link as={NavLink} to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
                  Projects
                </Nav.Link>
                <Nav.Link as={NavLink} to="/teams" className={({ isActive }) => (isActive ? "active" : "")}>
                  Teams
                </Nav.Link>
                {authUser.role === "Admin" && (
                  <Nav.Link as={NavLink} to="/users" className={({ isActive }) => (isActive ? "active" : "")}>
                    Manage Users
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          {authUser && (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
