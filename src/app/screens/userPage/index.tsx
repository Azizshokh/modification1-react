import { Box, Container, Stack } from "@mui/material";
import { Settings } from "./Settings";
import "../../../css/user/userPage.css";

export function UserPage() {
  const authMember = null;

  return (
    <div className={"user-page"}>
      <Container>
        {/* Page Header */}
        <div className={"page-header"}>
          <div className={"page-header-badge"}>
            <img src={"/icons/paw.svg"} alt="paw" className={"paw-icon"} />
            <span>Pet Owner Profile</span>
          </div>
          <h1 className={"page-title"}>My Account</h1>
          <p className={"page-subtitle"}>
            Manage your profile and pet food preferences
          </p>
        </div>

        <Stack className={"my-page-frame"}>
          {/* LEFT — Settings Form */}
          <Stack className={"my-page-left"}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box className={"menu-name"}>
                <img
                  src={"/icons/edit-paw.svg"}
                  alt=""
                  className={"menu-icon"}
                />
                Update My Details
              </Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          {/* RIGHT — Profile Card */}
          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              {/* Profile Avatar */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className={"order-user-img"}>
                  <div className={"avatar-ring"}></div>
                  <div className={"order-user-icon-box"}></div>
                </div>

                <span className={"order-user-name"}>{authMember}</span>

                <span className={"member-type-tag"}>{authMember}</span>

                <span className={"order-user-addr"}>
                  <img
                    src={"/icons/location.svg"}
                    alt=""
                    className={"inline-icon"}
                  />
                  {authMember}
                </span>
              </Box>

              {/* Divider */}
              <div className={"profile-divider"}>
                <span>About Me</span>
              </div>

              {/* Description */}
              <p className={"user-desc"}>{authMember}</p>

              {/* Pet Stats */}
              <div className={"pet-stats"}>
                <div className={"stat-item"}>
                  <span className={"stat-number"}>⭐</span>
                  <span className={"stat-label"}>Member Point</span>
                </div>
              </div>

              {/* Social Media */}
              <div className={"user-media-box"}>
                <a
                  href="#"
                  className={"social-link facebook"}
                  aria-label="Facebook"
                >
                  <img src={"/icons/Facebook.png"} alt="Facebook" />
                </a>
                <a
                  href="#"
                  className={"social-link instagram"}
                  aria-label="Instagram"
                >
                  <img src={"/icons/Instagram.png"} alt="Instagram" />
                </a>
                <a
                  href="#"
                  className={"social-link twitter"}
                  aria-label="Twitter"
                >
                  <img src={"/icons/Twitter.png"} alt="Twitter" />
                </a>
                <a
                  href="#"
                  className={"social-link youtube"}
                  aria-label="YouTube"
                >
                  <img src={"/icons/YouTube.png"} alt="YouTube" />
                </a>
              </div>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
