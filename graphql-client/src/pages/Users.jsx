// src/pages/Users.jsx
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Container, Table, Spinner, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!, $role: String!) {
    createUser(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
    }
  }
`;

function Users() {
  const { authUser } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [createUser, { error: createError }] = useMutation(CREATE_USER);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Member",
  });

  if (!authUser || authUser.role !== "Admin") {
    return (
      <Container>
        <Alert variant="danger">You do not have permission to view this page.</Alert>
      </Container>
    );
  }

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error fetching users</Alert>;

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser({ variables: formData });
      setFormData({ username: "", email: "", password: "", role: "Member" });
      refetch();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <Container>
      <h2>Manage Users</h2>
      <Form onSubmit={handleCreateUser} className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Control type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          </Col>
          <Col md={3}>
            <Form.Control type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </Col>
          <Col md={3}>
            <Form.Control type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </Col>
          <Col md={2}>
            <Form.Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Col>
          <Col md={1}>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Col>
        </Row>
        {createError && <Alert variant="danger">{createError.message}</Alert>}
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Users;
