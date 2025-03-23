// src/pages/TeamDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Container, Spinner, Table, Alert } from "react-bootstrap";

const GET_TEAM = gql`
  query GetTeam($id: ID!) {
    team(id: $id) {
      id
      teamName
      description
      status
      slogan
      members {
        id
        username
        email
      }
    }
  }
`;

function TeamDetails() {
  const { teamId } = useParams();
  const { data, loading, error } = useQuery(GET_TEAM, {
    variables: { id: teamId },
  });

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error loading team details</Alert>;

  const { team } = data;
  if (!team) return <Alert variant="info">Team not found</Alert>;

  return (
    <Container>
      <h2>Team Details</h2>
      <h4>{team.teamName}</h4>
      <p>Description: {team.description}</p>
      <p>Status: {team.status}</p>
      <p>Slogan: {team.slogan}</p>
      <h5>Members</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {team.members.map((member) => (
            <tr key={member.id}>
              <td>{member.username}</td>
              <td>{member.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default TeamDetails;
