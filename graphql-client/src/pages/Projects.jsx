// src/pages/Projects.jsx
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Container, Table, Spinner, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      projectName
      status
      team {
        id
        teamName
        members {
          id
          username
          email
          role
        }
      }
    }
  }
`;

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
      teamName
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation CreateProject($projectName: String!, $description: String, $team: ID, $startDate: String, $endDate: String, $status: String) {
    createProject(projectName: $projectName, description: $description, team: $team, startDate: $startDate, endDate: $endDate, status: $status) {
      id
      projectName
      status
      team {
        id
        teamName
      }
    }
  }
`;

function Projects() {
  const { authUser } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS);
  const { data: teamsData } = useQuery(GET_TEAMS);

  const [createProject] = useMutation(CREATE_PROJECT);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    team: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  if (!authUser) {
    return (
      <Container>
        <Alert variant="danger">Please log in first.</Alert>
      </Container>
    );
  }

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error fetching projects</Alert>;

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject({
        variables: {
          projectName: formData.projectName,
          description: formData.description || "",
          team: formData.team || null,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          status: formData.status,
        },
      });
      setFormData({
        projectName: "",
        description: "",
        team: "",
        startDate: "",
        endDate: "",
        status: "Pending",
      });
      refetch();
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  console.log(data);

  return (
    <Container>
      <h2>Projects</h2>
      {authUser.role === "Admin" && (
        <Form onSubmit={handleCreateProject} className="mb-4">
          <Row className="mb-3">
            <Col md={3}>
              <Form.Control type="text" placeholder="Project Name" value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} />
            </Col>
            <Col md={3}>
              <Form.Control type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Col>
            <Col md={2}>
              <Form.Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            </Col>
            <Col md={2}>
              <Form.Control type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            </Col>
          </Row>
          {teamsData && (
            <Row className="mb-3">
              <Col md={3}>
                <Form.Select value={formData.team} onChange={(e) => setFormData({ ...formData, team: e.target.value })}>
                  <option value="">Select Team (optional)</option>
                  {teamsData.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.teamName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="primary" type="submit">
                  Create
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Status</th>
            <th>Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.projects.map((project) => (
            <tr key={project.id}>
              <td>{project.projectName}</td>
              <td>{project.status}</td>
              <td>{project.team ? project.team.teamName : "Unassigned"}</td>
              <td>
                <Button as={Link} to={`/projects/${project.id}`} variant="outline-primary" size="sm">
                  View
                </Button>{" "}
                {/* If the user is a Member on that team or Admin, allow status update */}
                {(authUser.role === "Admin" || project.team?.members?.some((m) => m.id === authUser.id)) && (
                  <Button as={Link} to={`/projects/${project.id}/update`} variant="outline-secondary" size="sm">
                    Update Status
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={() => refetch()}>
        Refetch
      </Button>
    </Container>
  );
}

export default Projects;
