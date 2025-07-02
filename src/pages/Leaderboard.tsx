// src/pages/Leaderboard.tsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Navigation from "@/components/Navigation";

interface LeaderboardRow {
  display_name: string | null;
  high_score: number;
  total_games: number;
  levels_completed: number;
}

const Leaderboard: React.FC = () => {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (res.ok) {
          setRows(data as LeaderboardRow[]);
        } else {
          console.error(data.error || 'Failed to load leaderboard');
        }
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card bg="dark" text="light">
              <Card.Header>
                <h3>🏆 Bootstrap vs Zombies: Hall of Fame</h3>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div>Loading…</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Bootstrap Warrior</TableHead>
                        <TableHead>High Score</TableHead>
                        <TableHead>Games Played</TableHead>
                        <TableHead>Levels Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((r, i) => (
                        <TableRow key={r.display_name + i}>
                          <TableCell>
                            <strong>#{i + 1}</strong>{" "}
                            {i === 0
                              ? "👑"
                              : i === 1
                              ? "🥈"
                              : i === 2
                              ? "🥉"
                              : ""}
                          </TableCell>
                          <TableCell>{r.display_name ?? "Unknown"}</TableCell>
                          <TableCell className="text-success">
                            <strong>{r.high_score.toLocaleString()}</strong>
                          </TableCell>
                          <TableCell>{r.total_games}</TableCell>
                          <TableCell>{r.levels_completed}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Leaderboard;







