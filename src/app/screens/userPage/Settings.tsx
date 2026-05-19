import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "",
  );

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberAddress: authMember?.memberAddress,
      memberDesc: authMember?.memberDesc,
      memberImage: authMember?.memberImage,
    },
  );

  /** Keep local form in sync whenever the context authMember changes
   *  (after save, after login from another tab, or external update). */
  useEffect(() => {
    if (!authMember) return;
    setMemberUpdateInput({
      memberNick: authMember.memberNick,
      memberPhone: authMember.memberPhone,
      memberAddress: authMember.memberAddress,
      memberDesc: authMember.memberDesc,
      memberImage: authMember.memberImage,
    });
    setMemberImage(
      authMember.memberImage
        ? `${serverApi}/${authMember.memberImage}`
        : "",
    );
  }, [
    authMember?._id,
    authMember?.memberNick,
    authMember?.memberPhone,
    authMember?.memberAddress,
    authMember?.memberDesc,
    authMember?.memberImage,
  ]);

  /** HANDLERS **/
  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAddressHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDescriptionHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }

      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Modified successfully!!!", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    console.log("files:", file);
    const fileType = file.type,
      validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else {
      if (file) {
        memberUpdateInput.memberImage = file;
        setMemberUpdateInput({ ...memberUpdateInput });
        setMemberImage(URL.createObjectURL(file));
      }
    }
  };

  return (
    <Box className={"settings"}>
      {/* ── Avatar Upload ── */}
      <Box className={"member-media-frame"}>
        <div className={"avatar-upload-wrap"}>
          {memberImage ? (
            <img
              src={memberImage}
              className={"mb-image"}
              alt={"Profile preview"}
              onError={() => setMemberImage("")}
            />
          ) : (
            <div className={"mb-image mb-image-empty"} />
          )}
        </div>

        <div className={"media-change-box"}>
          <div className={"upload-label"}>
            <PhotoCameraIcon className={"upload-icon"} />
            <span>Upload Profile Photo</span>
          </div>
          <p className={"upload-hint"}>JPG, JPEG or PNG formats only!</p>
          <div className={"up-del-box"}>
            <Button
              component="label"
              className={"upload-action-btn"}
              startIcon={<CloudDownloadIcon />}
              onChange={handleImageViewer}
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
            placeholder={authMember?.memberNick}
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={memberNickHandler}
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
            placeholder={authMember?.memberPhone ?? "no phone"}
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandler}
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
            placeholder={
              authMember?.memberAddress
                ? authMember.memberAddress
                : "no address"
            }
            value={memberUpdateInput.memberAddress}
            name="memberAddress"
            onChange={memberAddressHandler}
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
              authMember?.memberDesc ? authMember.memberDesc : "no description"
            }
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            onChange={memberDescriptionHandler}
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
          onClick={handleSubmitButton}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
