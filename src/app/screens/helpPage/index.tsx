import React from "react";
import { Box, Container, Stack, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import "../../../css/help/help.css";

const terms: string[] = [
  "1. You must be 18 years or older to use this service.",
  "2. All pet food products are intended for animal consumption only.",
  "3. We reserve the right to refuse service to anyone at any time.",
  "4. Orders are processed within 1–2 business days.",
  "5. Refunds are accepted within 7 days of delivery for unopened products.",
  "6. We are not responsible for adverse reactions due to undisclosed pet allergies.",
  "7. Prices are subject to change without prior notice.",
  "8. Personal data is handled in accordance with our Privacy Policy.",
];

const faq: { question: string; answer: string }[] = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, add items to your basket, and proceed to checkout. You will receive an email confirmation once your order is placed.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit/debit cards, PayPal, and cash on delivery.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "You can modify or cancel your order within 1 hour of placing it by contacting our support team.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 2–4 business days. Express delivery is available at checkout.",
  },
  {
    question: "Are the products suitable for all pet breeds?",
    answer:
      "Our product pages include breed and size recommendations. Please check before purchasing.",
  },
];

export default function HelpPage() {
  const [value, setValue] = React.useState("1");

  /** HANDLERS **/
  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="help-page">
      {/* ── Hero Header ── */}
      <div className="help-hero">
        <Typography className="help-hero-title">Help Center 🐾</Typography>
        <Typography className="help-hero-subtitle">
          Everything you need to know about PetFood
        </Typography>
      </div>

      <Container className="help-container">
        {/* ── Tab Navigation ── */}
        <Box className="help-menu">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="help page tabs"
              className="table_list"
            >
              <Tab label="📄 Terms" value="1" />
              <Tab label="❓ FAQ" value="2" />
              <Tab label="✉️ Contact" value="3" />
            </Tabs>
          </Box>
        </Box>

        {/* ── Tab Panels ── */}
        <Stack className="help-main-content">
          {/* ─── TERMS ─── */}
          {value === "1" && (
            <Stack className="rules-box">
              <div className="section-badge">📋 Terms &amp; Conditions</div>
              <Box className="rules-frame">
                {terms.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </Box>
            </Stack>
          )}

          {/* ─── FAQ ─── */}
          {value === "2" && (
            <>
              <div className="section-badge">🐶 Frequently Asked Questions</div>
              <Stack className="accordion-menu">
                {faq.map((item, index) => (
                  <Accordion key={index} disableGutters elevation={0}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`faq-panel-${index}-content`}
                      id={`faq-panel-${index}-header`}
                    >
                      <Typography>{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{item.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </>
          )}

          {/* ─── CONTACT ─── */}
          {value === "3" && (
            <Stack className="admin-letter-box">
              <Stack className="admin-letter-container">
                {/* Header */}
                <div className="admin-letter-header">
                  <span>Contact Us!</span>
                  <p>
                    Fill out the form below and we'll get back to you soon 🐾
                  </p>
                </div>

                {/* Form */}
                <form action="#" method="POST" className="admin-letter-form">
                  <div className="admin-input-box">
                    <label htmlFor="memberNick">Your name</label>
                    <input
                      id="memberNick"
                      type="text"
                      name="memberNick"
                      placeholder="Type your name here"
                    />
                  </div>

                  <div className="admin-input-box">
                    <label htmlFor="memberEmail">Your email</label>
                    <input
                      id="memberEmail"
                      type="email"
                      name="memberEmail"
                      placeholder="Type your email here"
                    />
                  </div>

                  <div className="admin-input-box">
                    <label htmlFor="memberMsg">Message</label>
                    <textarea
                      id="memberMsg"
                      name="memberMsg"
                      placeholder="How can we help your furry friend? 🐾"
                    />
                  </div>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: "8px",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      className="contact-send-btn"
                      disableElevation
                    >
                      Send Message
                    </Button>
                  </Box>
                </form>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Container>
    </div>
  );
}
