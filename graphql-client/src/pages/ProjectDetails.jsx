// src/pages/ProjectDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Container, Spinner, Alert } from "react-bootstrap";

const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      projectName
      description
      status
      startDate
      endDate
      team {
        id
        teamName
        members {
          id
          username
        }
      }
    }
  }
`;

function ProjectDetails() {
  const { projectId } = useParams();
  const { data, loading, error } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error loading project</Alert>;

  const { project } = data;
  if (!project) return <Alert variant="info">Project not found</Alert>;

  return (
    <Container>
      <h2>Project Details</h2>
      <h4>{project.projectName}</h4>
      <p>Status: {project.status}</p>
      <p>Description: {project.description}</p>
      <p>Start Date: {project.startDate?.slice(0, 10) || "N/A"}</p>
      <p>End Date: {project.endDate?.slice(0, 10) || "N/A"}</p>
      {project.team && (
        <>
          <h5>Assigned Team: {project.team.teamName}</h5>
          <p>Members:</p>
          <ul>
            {project.team.members.map((m) => (
              <li key={m.id}>{m.username}</li>
            ))}
          </ul>
        </>
      )}
    </Container>
  );
}

export default ProjectDetails;
