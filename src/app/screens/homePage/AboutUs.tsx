import React from "react";
import { Box, Container, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PetsIcon from "@mui/icons-material/Pets";
import "./../../../css/home/aboutUs.css";

// ─── Stat item data ───────────────────────────────────────────────
interface StatItem {
  value: string;
  label: string;
  color: "green" | "red" | "gold";
  icon?: React.ReactNode;
}

const STATS: StatItem[] = [
  { value: "10K+", label: "Happy Customers", color: "red" },
  { value: "98+", label: "Pet Satisfactions", color: "green" },
  {
    value: "5",
    label: "Gust Experience",
    color: "gold",
    icon: <StarIcon className="about__star-icon" />,
  },
];

// ─── Component ────────────────────────────────────────────────────
export default function AboutUs(): React.JSX.Element {
  return (
    <div className="about-frame">
      <Container>
        <Stack className="about__inner">
          {/* ── Left: video ── */}
          <Box className="about__img-wrap">
            <video
              className="about__img"
              src="/video/storyboard.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </Box>

          {/* ── Right: content ── */}
          <Stack className="about__content">
            {/* Title */}
            <Box className="about__title-wrap">
              <h2 className="about__title">About Us</h2>
              <PetsIcon className="about__title-paw" />
            </Box>

            {/* Bold tagline */}
            <p className="about__tagline">
              Bringing pets together with nutritious food, warm care, and a
              passion for great service.
            </p>

            {/* Body text */}
            <p className="about__body">
              We believe every pet deserves the best. Our carefully curated
              selection of premium pet foods is sourced from trusted brands
              around the world. From puppies to senior cats, we have everything
              your furry friend needs to thrive — delivered straight to your
              door with love.
            </p>

            {/* Stats row */}
            <Stack className="about__stats-row">
              {STATS.map((stat) => (
                <Box key={stat.label} className="about__stat-item">
                  <Box
                    className={`about__stat-value about__stat-value--${stat.color}`}
                  >
                    {stat.value}
                    {stat.icon}
                  </Box>
                  <span className="about__stat-label">{stat.label}</span>
                </Box>
              ))}
            </Stack>

            {/* Owner */}
            <Box className="about__owner">
              <img
                src="/img/justin.jpeg"
                alt="Owner"
                className="about__owner-img"
              />
              <Box className="about__owner-info">
                <span className="about__owner-name">MIT35 ALI</span>
                <span className="about__owner-role">Owner</span>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
