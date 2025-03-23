import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

function Login() {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (authUser) {
      navigate("/dashboard");
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: formData });
      // Immediately update AuthContext with the returned user
      setAuthUser(data.login.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Login</h2>
          {error && <Alert variant="danger">Invalid credentials</Alert>}
          <Form onSubmit={handleSubmit} style={{ width: "400px" }}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
