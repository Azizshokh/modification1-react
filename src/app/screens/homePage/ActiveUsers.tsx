import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import StarIcon from "@mui/icons-material/Star";
import "./../../../css/home/activeUsers.css";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";

/** Redux Slice & Selector **/
const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

export default function ActiveUsers(): React.JSX.Element {
  const { topUsers } = useSelector(topUsersRetriever);
  const safeTopUsers = Array.isArray(topUsers) ? topUsers : [];

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
            {safeTopUsers.length !== 0 ? (
              safeTopUsers.map((member: Member) => (
                <UserCard key={member._id} member={member} />
              ))
            ) : (
              <Box className="active-users__no-data">No Active Users</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}

// ─── User Card ────────────────────────────────────────────────────
function UserCard({ member }: { member: Member }) {
  const [imgError, setImgError] = useState<boolean>(false);
  const imagePath = member.memberImage
    ? `${serverApi}/${member.memberImage}`
    : "/img/default-user.png";

  return (
    <Box className="user-card">
      {/* Image */}
      <Box className="user-card__img-wrap">
        {!imgError ? (
          <img
            src={imagePath}
            alt={member.memberNick}
            className="user-card__img"
            onError={() => setImgError(true)}
          />
        ) : (
          <Box className="user-card__img-fallback">🐾</Box>
        )}
        <span className="user-card__online-dot" />
      </Box>

      {/* Name + points */}
      <Box className="user-card__info">
        <span className="user-card__name">{member.memberNick}</span>
        <span className="user-card__points">
          <StarIcon className="user-card__star-icon" />
          {member.memberPoints}
        </span>
      </Box>
    </Box>
  );
}
