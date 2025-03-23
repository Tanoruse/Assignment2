// src/pages/Teams.jsx
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Container, Table, Spinner, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
      teamName
      status
      members {
        id
        username
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
    }
  }
`;

const CREATE_TEAM = gql`
  mutation CreateTeam($teamName: String!, $description: String, $status: String, $slogan: String, $members: [ID]) {
    createTeam(teamName: $teamName, description: $description, status: $status, slogan: $slogan, members: $members) {
      id
      teamName
      status
      members {
        id
        username
      }
    }
  }
`;

function Teams() {
  const { authUser } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_TEAMS);
  const { data: usersData } = useQuery(GET_USERS, {
    skip: !authUser || authUser.role !== "Admin",
  });

  const [createTeam] = useMutation(CREATE_TEAM);

  const [formData, setFormData] = useState({
    teamName: "",
    description: "",
    status: "Active",
    slogan: "",
    members: [],
  });

  if (!authUser) {
    return (
      <Container>
        <Alert variant="danger">Please log in first.</Alert>
      </Container>
    );
  }

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error fetching teams</Alert>;

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam({
        variables: {
          ...formData,
          members: formData.members.map((m) => m),
        },
      });
      setFormData({
        teamName: "",
        description: "",
        status: "Active",
        slogan: "",
        members: [],
      });
      refetch();
    } catch (err) {
      console.error("Error creating team:", err);
    }
  };

  const handleMemberSelection = (userId) => {
    setFormData((prev) => {
      if (prev.members.includes(userId)) {
        return {
          ...prev,
          members: prev.members.filter((m) => m !== userId),
        };
      } else {
        return {
          ...prev,
          members: [...prev.members, userId],
        };
      }
    });
  };

  return (
    <Container>
      <h2>Teams</h2>
      {authUser.role === "Admin" && (
        <Form onSubmit={handleCreateTeam} className="mb-4">
          <Row className="mb-3">
            <Col md={3}>
              <Form.Control type="text" placeholder="Team Name" value={formData.teamName} onChange={(e) => setFormData({ ...formData, teamName: e.target.value })} />
            </Col>
            <Col md={3}>
              <Form.Control type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Col>
            <Col md={2}>
              <Form.Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control type="text" placeholder="Slogan" value={formData.slogan} onChange={(e) => setFormData({ ...formData, slogan: e.target.value })} />
            </Col>
            <Col md={1}>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Col>
          </Row>
          {usersData && (
            <Row className="mb-3">
              <Col>
                <p>Add members:</p>
                {usersData.users.map((u) => (
                  <Form.Check inline key={u.id} label={u.username} type="checkbox" checked={formData.members.includes(u.id)} onChange={() => handleMemberSelection(u.id)} />
                ))}
              </Col>
            </Row>
          )}
        </Form>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Status</th>
            <th>Members</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.teams.map((team) => (
            <tr key={team.id}>
              <td>{team.teamName}</td>
              <td>{team.status}</td>
              <td>{team.members.map((m) => m.username).join(", ")}</td>
              <td>
                <Button as={Link} to={`/teams/${team.id}`} variant="outline-primary" size="sm">
                  View
                </Button>
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

export default Teams;
