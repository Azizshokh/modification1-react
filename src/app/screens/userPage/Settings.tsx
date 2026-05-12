import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();

  const [memberImage, setMemberImage] = useState<string>();

  /** HANDLERS **/
  return (
    <Box className={"settings"}>
      {/* ── Avatar Upload ── */}
      <Box className={"member-media-frame"}>
        <div className={"avatar-upload-wrap"}>
          <img
            src={memberImage}
            className={"mb-image"}
            alt={"Profile preview"}
          />
          <div className={"avatar-overlay"}>
            <Button component="label" className={"upload-btn"}>
              <CloudDownloadIcon />
              <input type="file" hidden />
            </Button>
          </div>
        </div>

        <div className={"media-change-box"}>
          <div className={"upload-label"}>
            <PhotoCameraIcon className={"upload-icon"} />
            <span>Upload Profile Photo</span>
          </div>
          <p className={"upload-hint"}>JPG, JPEG or PNG — max 5MB</p>
          <div className={"up-del-box"}>
            <Button
              component="label"
              className={"upload-action-btn"}
              startIcon={<CloudDownloadIcon />}
            >
              Choose Image
              <input type="file" hidden />
            </Button>
          </div>
        </div>
      </Box>

      {/* ── Section Heading ── */}
      <div className={"section-heading"}>
        <PetsIcon sx={{ fontSize: 14, opacity: 0.6 }} />
        <span>Basic Information</span>
      </div>

      {/* ── Username ── */}
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>
            <PersonIcon className={"label-icon"} />
            Username
          </label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={authMember?.memberNick ?? "Your username"}
            value={authMember?.memberNick ?? ""}
            name="memberNick"
            onChange={() => {}}
          />
        </div>
      </Box>

      {/* ── Phone & Address ── */}
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>
            <PhoneIcon className={"label-icon"} />
            Phone
          </label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={authMember?.memberPhone ?? "Your phone number"}
            value={authMember?.memberPhone ?? ""}
            name="memberPhone"
            onChange={() => {}}
          />
        </div>

        <div className={"short-input"}>
          <label className={"spec-label"}>
            <LocationOnIcon className={"label-icon"} />
            Address
          </label>
          <input
            className={"spec-input mb-address"}
            type="text"
            placeholder={authMember?.memberAddress ?? "Delivery address"}
            value={authMember?.memberAddress ?? ""}
            name="memberAddress"
            onChange={() => {}}
          />
        </div>
      </Box>

      {/* ── Section Heading ── */}
      <div className={"section-heading"}>
        <PetsIcon sx={{ fontSize: 14, opacity: 0.6 }} />
        <span>About Me &amp; My Pets</span>
      </div>

      {/* ── Description ── */}
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>
            <NoteAltIcon className={"label-icon"} />
            Description
          </label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={
              authMember?.memberDesc ??
              "Tell us about yourself and your pets! 🐶🐱🐹"
            }
            value={authMember?.memberDesc ?? ""}
            name="memberDesc"
            onChange={() => {}}
            rows={4}
          />
        </div>
      </Box>

      {/* ── Save Button ── */}
      <Box className={"save-box"}>
        <Button
          variant={"contained"}
          className={"save-btn"}
          startIcon={<SaveAltIcon />}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
function useGlobals(): { authMember: any; setAuthMember: any } {
  const [authMember, setAuthMember] = useState<any>(null);
  return { authMember, setAuthMember };
}
