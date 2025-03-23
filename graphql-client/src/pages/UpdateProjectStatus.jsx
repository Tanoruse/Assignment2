// src/pages/UpdateProjectStatus.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Container, Form, Button, Alert } from "react-bootstrap";

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $status: String) {
    updateProject(id: $id, status: $status) {
      id
      projectName
      status
    }
  }
`;

function UpdateProjectStatus() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Pending");
  const [updateProject, { error }] = useMutation(UPDATE_PROJECT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject({ variables: { id: projectId, status } });
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  return (
    <Container>
      <h2>Update Project Status</h2>
      {error && <Alert variant="danger">{error.message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary">
          Update
        </Button>
      </Form>
    </Container>
  );
}

export default UpdateProjectStatus;
