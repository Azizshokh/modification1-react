import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PetsIcon from "@mui/icons-material/Pets";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ContactlessIcon from "@mui/icons-material/Contactless";
import SimCardIcon from "@mui/icons-material/SimCard";
import EventIcon from "@mui/icons-material/Event";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { Settings } from "./Settings";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import "../../../css/user/userPage.css";

export function UserPage() {
  const navigate = useNavigate();
  const { authMember } = useGlobals();

  useEffect(() => {
    if (!authMember) navigate("/");
  }, [authMember, navigate]);

  if (!authMember) return null;

  return (
    <div className={"user-page"}>
      <Container>
        {/* Page Header */}
        <div className={"page-header"}>
          <div className={"page-header-badge"}>
            <PetsIcon className={"paw-icon"} />
            <span>Pet Owner Profile</span>
          </div>
          <h1 className={"page-title"}>My Account</h1>
          <p className={"page-subtitle"}>
            Manage your profile and pet food preferences
          </p>
        </div>

        <Stack className={"my-page-frame"}>
          {/* LEFT — Settings */}
          <Stack className={"my-page-left"}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box className={"menu-name"}>
                <ManageAccountsIcon className={"menu-icon"} />
                Member Details
              </Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          {/* RIGHT — Profile Card */}
          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className={"order-user-img"}>
                  <div className={"avatar-ring"}>
                    <img
                      src={
                        authMember?.memberImage
                          ? `${serverApi}/${authMember.memberImage}`
                          : "/icons/default-user.svg"
                      }
                      className={"order-user-avatar"}
                      alt={authMember?.memberNick}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/icons/default-user.svg";
                      }}
                    />
                  </div>
                </div>

                <span className={"order-user-name"}>
                  {authMember?.memberNick}
                </span>

                <span className={"member-type-tag"}>
                  <VerifiedRoundedIcon sx={{ fontSize: 14 }} />
                  {authMember?.memberType}
                </span>

                <span className={"order-user-addr"}>
                  <LocationOnIcon className={"inline-icon"} />
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "no address"}
                </span>
              </Box>

              {/* Divider */}
              <div className={"profile-divider"}>
                <PetsIcon sx={{ fontSize: 12 }} />
                <span>About Me</span>
                <PetsIcon sx={{ fontSize: 12 }} />
              </div>

              <p className={"user-desc"}>
                {authMember?.memberDesc
                  ? authMember.memberDesc
                  : "no description"}
              </p>

              {/* Pet Stats */}
              <div className={"pet-stats"}>
                <div className={"stat-item"}>
                  <span className={"stat-number"}>
                    <StarRoundedIcon
                      sx={{ fontSize: 22, color: "var(--pf-accent)" }}
                    />
                    {authMember?.memberPoints ?? 0}
                  </span>
                  <span className={"stat-label"}>Member Points</span>
                </div>
              </div>

              {/* Social Media */}
              <div className={"user-media-box"}>
                <a
                  href="#"
                  className={"social-link facebook"}
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  className={"social-link instagram"}
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  className={"social-link telegram"}
                  aria-label="Telegram"
                >
                  <TelegramIcon />
                </a>
                <a
                  href="#"
                  className={"social-link youtube"}
                  aria-label="YouTube"
                >
                  <YouTubeIcon />
                </a>
              </div>
            </Box>

            {/* Payment Methods Card */}
            <Box className={"order-info-box payment-card-box"}>
              <div className={"payment-card-heading"}>
                <PaymentsRoundedIcon className={"payment-card-icon"} />
                <span>Payment Methods</span>
              </div>
              {/* Inputs */}
              <div className={"cc-field"}>
                <label className={"cc-label"}>
                  <CreditCardIcon className={"cc-label-icon"} />
                  Card Number
                </label>
                <input
                  className={"card-input"}
                  placeholder={"5243  4090  2002  7495"}
                />
              </div>

              <Stack
                direction={"row"}
                sx={{ justifyContent: "space-between", gap: 1.5 }}
              >
                <div className={"cc-field cc-half"}>
                  <label className={"cc-label"}>
                    <EventIcon className={"cc-label-icon"} />
                    Expiry
                  </label>
                  <input
                    className={"card-half-input"}
                    placeholder={"07 / 24"}
                  />
                </div>
                <div className={"cc-field cc-half"}>
                  <label className={"cc-label"}>
                    <LockOutlinedIcon className={"cc-label-icon"} />
                    CVV
                  </label>
                  <input className={"card-half-input"} placeholder={"•••"} />
                </div>
              </Stack>
              <Stack className={"cards-box"}>
                <div
                  className={"pay-brand pay-mastercard"}
                  aria-label={"Mastercard"}
                >
                  <span className={"mc-circles"}>
                    <span className={"mc-red"} />
                    <span className={"mc-yellow"} />
                  </span>
                  <span className={"pay-brand-text"}>Mastercard</span>
                </div>
                <div className={"pay-brand pay-visa"} aria-label={"Visa"}>
                  <span className={"pay-brand-text visa-text"}>VISA</span>
                </div>
                <div className={"pay-brand pay-paypal"} aria-label={"PayPal"}>
                  <span className={"pay-brand-text paypal-text"}>
                    <span className={"pp-blue"}>Pay</span>
                    <span className={"pp-navy"}>Pal</span>
                  </span>
                </div>
                <div
                  className={"pay-brand pay-western"}
                  aria-label={"Western Union"}
                >
                  <span className={"pay-brand-text wu-text"}>WU</span>
                </div>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
