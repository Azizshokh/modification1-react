import React from "react";
import { Box, Container, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RateReviewIcon from "@mui/icons-material/RateReview";

import "../../../css/home/homePage.css";

export default function OurServices(): React.JSX.Element {
  return (
    <div className="homepage">
      {/* FEATURES  */}
      <Box className="feature-row">
        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#17a48a" }}>
            <img
              src="/icons/delivery.png"
              alt="Delivery"
              width={22}
              height={22}
            />
          </span>
          <Box>
            <strong>Fast Delivery</strong>
            <span>Quick and safe delivery at your door</span>
          </Box>
        </Stack>

        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#e05c2a" }}>
            <img
              src="/icons/nearestplace.png"
              alt="Nearest place"
              width={22}
              height={22}
            />
          </span>
          <Box>
            <strong>Nearest Place</strong>
            <span>Find pet food near you easily</span>
          </Box>
        </Stack>

        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#e07c2a" }}>
            <CalendarMonthIcon sx={{ color: "white", fontSize: 22 }} />
          </span>
          <Box>
            <strong>Book Your Order</strong>
            <span>Schedule your order in advance</span>
          </Box>
        </Stack>

        <Stack className="feature-item">
          <span className="feature-emoji" style={{ background: "#e0a82a" }}>
            <RateReviewIcon sx={{ color: "white", fontSize: 22 }} />
          </span>
          <Box>
            <strong>Customer Review</strong>
            <span>See what pet parents are saying</span>
          </Box>
        </Stack>
      </Box>
    </div>
  );
}
