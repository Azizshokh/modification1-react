import React from "react";
import { Box, Container, Stack } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import "./../../../css/activeUsers.css";

// ─── Types ───────────────────────────────────────────────────────
interface Member {
  id: number;
  nick: string;
  points: number;
  image: string;
}

// ─── Mock data ────────────────────────────────────────────────────
const MEMBERS: Member[] = [
  { id: 1, nick: "PawLover", points: 320, image: "/img/justin.jpeg" },
  { id: 2, nick: "CatMom99", points: 280, image: "/img/justin.jpeg" },
  { id: 3, nick: "DogDad_K", points: 215, image: "/img/justin.jpeg" },
  { id: 4, nick: "FurFriend", points: 190, image: "/img/justin.jpeg" },
];

export default function ActiveUsers(): React.JSX.Element {
  return (
    <div className="active-users-frame">
      <Container>
        <Stack className="active-users__inner">
          {/* ── Section title ── */}
          <Box className="active-users__title-wrap">
            <PetsIcon className="active-users__title-icon" />
            <h2 className="active-users__title">Active Users</h2>
            <PetsIcon className="active-users__title-icon" />
          </Box>

          {/* ── Cards grid ── */}
          <Stack className="active-users__cards">
            {MEMBERS.map((member) => (
              <Box key={member.id} className="user-card">
                {/* Full image */}
                <Box className="user-card__img-wrap">
                  <img
                    src={member.image}
                    alt={member.nick}
                    className="user-card__img"
                  />
                  <span className="user-card__online-dot" />
                </Box>

                {/* Name below image */}
                <Box className="user-card__info">
                  <span className="user-card__name">{member.nick}</span>
                  <span className="user-card__points">
                    🐾 {member.points} pts
                  </span>
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
