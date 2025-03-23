// src/pages/Dashboard.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { authUser } = useAuth();

  if (!authUser) {
    return (
      <Container>
        <h2>Please log in to view your dashboard.</h2>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>Welcome, {authUser.username}!</h2>
          <p>Your role is: {authUser.role}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
