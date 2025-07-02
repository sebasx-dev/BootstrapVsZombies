import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <>
        <Navigation />
        <Container>
          <div className="text-center">Loading...</div>
        </Container>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="mb-4">👤 User Profile</h2>
            <Card className="mb-4">
              <Card.Header>
                <h5>Profile Information</h5>
              </Card.Header>
              <Card.Body>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
