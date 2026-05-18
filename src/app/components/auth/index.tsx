import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LoginIcon from "@mui/icons-material/Login";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PetsIcon from "@mui/icons-material/Pets";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import type {
  LoginInput,
  Member,
  MemberInput,
} from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/auth/index.css";

export const useLogout = (): (() => Promise<void>) => {
  const { setAuthMember } = useGlobals();
  return async () => {
    try {
      await new MemberService().logout();
    } catch (err) {
      console.warn("logout: server call failed:", err);
    } finally {
      setAuthMember(null);
      sweetTopSmallSuccessAlert("Logged out successfully", 1800);
    }
  };
};

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  onSwitchToLogin?: () => void;
  onSwitchToSignup?: () => void;
}

export default function AuthenticationModal({
  signupOpen,
  loginOpen,
  handleSignupClose,
  handleLoginClose,
  onSwitchToLogin,
  onSwitchToSignup,
}: AuthenticationModalProps): React.JSX.Element {
  /** GLOBAL STATE */
  const { setAuthMember } = useGlobals();

  /** STATE */
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    memberNick?: string;
    memberPhone?: string;
    memberPassword?: string;
  }>({});

  /** EFFECTS — reset on close */
  useEffect(() => {
    if (!signupOpen && !loginOpen) {
      resetForm();
    }
  }, [signupOpen, loginOpen]);

  /** HELPERS */
  const resetForm = () => {
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    setShowPassword(false);
    setErrorMessage("");
    setFieldErrors({});
    setIsSubmitting(false);
  };

  /** VALIDATION */
  const validateNick = (value: string): string | undefined => {
    const v = value.trim();
    if (!v) return "Username is required.";
    if (v.length < 3) return "Username must be at least 3 characters.";
    if (v.length > 20) return "Username must be 20 characters or fewer.";
    if (!/^[A-Za-z0-9_.-]+$/.test(v))
      return "Use letters, numbers, '.', '_' or '-' only.";
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    const v = value.trim();
    if (!v) return "Phone number is required.";
    const digits = v.replace(/[^\d]/g, "");
    if (digits.length < 7 || digits.length > 15)
      return "Enter a valid phone number (7–15 digits).";
    if (!/^\+?[\d\s()-]+$/.test(v))
      return "Phone may contain digits, spaces, '+', '(', ')' and '-' only.";
    return undefined;
  };

  const validatePassword = (
    value: string,
    mode: "signup" | "login",
  ): string | undefined => {
    if (!value) return "Password is required.";
    if (mode === "signup") {
      if (value.length < 6) return "Password must be at least 6 characters.";
      if (value.length > 64) return "Password must be 64 characters or fewer.";
      if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
        return "Password must include at least one letter and one number.";
    }
    return undefined;
  };

  const persistAuthMember = (member: Member) => {
    setAuthMember(member);
  };

  const closeSignupModal = () => {
    handleSignupClose();
  };

  const closeLoginModal = () => {
    handleLoginClose();
  };

  /** HANDLERS — inputs */
  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberNick(e.target.value);
    if (errorMessage) setErrorMessage("");
    if (fieldErrors.memberNick)
      setFieldErrors((prev) => ({ ...prev, memberNick: undefined }));
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberPhone(e.target.value);
    if (errorMessage) setErrorMessage("");
    if (fieldErrors.memberPhone)
      setFieldErrors((prev) => ({ ...prev, memberPhone: undefined }));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
    if (fieldErrors.memberPassword)
      setFieldErrors((prev) => ({ ...prev, memberPassword: undefined }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (signupOpen) handleSignupRequest().then();
    else if (loginOpen) handleLoginRequest().then();
  };

  /** HANDLERS — mode switch */
  const handleSwitchToLogin = () => {
    handleSignupClose();
    onSwitchToLogin?.();
  };

  const handleSwitchToSignup = () => {
    handleLoginClose();
    onSwitchToSignup?.();
  };

  /** HANDLERS — submit */
  const extractServerError = (err: unknown, fallback: string): string => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as
        | { message?: string; error?: string }
        | undefined;
      const status = err.response?.status;
      if (data?.message) return data.message;
      if (data?.error) return data.error;
      if (status === 401) return "Invalid username or password.";
      if (status === 403) return "This account is not allowed to sign in.";
      if (status === 409) return "This username is already taken.";
      if (status === 422) return "Some of the details are invalid.";
      if (status && status >= 500)
        return "Server is temporarily unavailable. Please try again.";
      if (err.code === "ERR_NETWORK")
        return "Network error. Please check your connection.";
    }
    if (err instanceof Error && err.message) return err.message;
    return fallback;
  };

  const handleSignupRequest = async () => {
    try {
      const nickErr = validateNick(memberNick);
      const phoneErr = validatePhone(memberPhone);
      const pwdErr = validatePassword(memberPassword, "signup");
      if (nickErr || phoneErr || pwdErr) {
        setFieldErrors({
          memberNick: nickErr,
          memberPhone: phoneErr,
          memberPassword: pwdErr,
        });
        setErrorMessage("Please fix the highlighted fields and try again.");
        return;
      }
      setFieldErrors({});
      setErrorMessage("");
      setIsSubmitting(true);

      const signupInput: MemberInput = {
        memberNick: memberNick.trim(),
        memberPhone: memberPhone.trim(),
        memberPassword: memberPassword,
      };

      const memberService = new MemberService();
      const result = await memberService.signup(signupInput);

      persistAuthMember(result);
      closeSignupModal();
      sweetTopSmallSuccessAlert(`Welcome to PetFood, ${result.memberNick}!`);
    } catch (err) {
      const message = extractServerError(
        err,
        "Signup failed. Please try again.",
      );
      setErrorMessage(message);
      sweetErrorHandling(err).then();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRequest = async () => {
    try {
      const nickErr = validateNick(memberNick);
      const pwdErr = validatePassword(memberPassword, "login");
      if (nickErr || pwdErr) {
        setFieldErrors({
          memberNick: nickErr,
          memberPassword: pwdErr,
        });
        setErrorMessage("Please fix the highlighted fields and try again.");
        return;
      }
      setFieldErrors({});
      setErrorMessage("");
      setIsSubmitting(true);

      const loginInput: LoginInput = {
        memberNick: memberNick.trim(),
        memberPassword: memberPassword,
      };

      const memberService = new MemberService();
      const result = await memberService.login(loginInput);

      persistAuthMember(result);
      closeLoginModal();
      sweetTopSmallSuccessAlert(`Welcome back, ${result.memberNick}!`);
    } catch (err) {
      const message = extractServerError(
        err,
        "Login failed. Please try again.",
      );
      setErrorMessage(message);
      sweetErrorHandling(err).then();
    } finally {
      setIsSubmitting(false);
    }
  };

  /** RENDER HELPERS */
  const renderVisualPanel = (mode: "signup" | "login") => {
    const isSignup = mode === "signup";
    return (
      <Box
        className={`auth-visual ${isSignup ? "" : "auth-visual--login"}`.trim()}
      >
        <img
          src="/img/auth.webp"
          alt={isSignup ? "PetFood signup" : "PetFood login"}
          className="auth-visual-image"
        />
        <div className="auth-visual-overlay">
          <span
            className={`auth-visual-badge ${
              isSignup ? "" : "auth-visual-badge--login"
            }`.trim()}
          >
            <PetsIcon className="auth-visual-badge-icon" />
            {isSignup ? "PetFood Club" : "Welcome Back"}
          </span>

          <Typography className="auth-visual-title">
            {isSignup
              ? "Where happy pets start their day."
              : "Sign in & spoil your furry friends."}
          </Typography>
          <Typography className="auth-visual-text">
            {isSignup
              ? "Create your PetFood account to order treats, track deliveries, and keep every pet routine on schedule."
              : "Pick up where you left off, check your orders, and keep your pet essentials just one click away."}
          </Typography>

          <ul className="auth-perks">
            <li className="auth-perk">
              <LocalShippingIcon className="auth-perk-icon" />
              <span>Free delivery on orders over $100</span>
            </li>
            <li className="auth-perk">
              <MedicalServicesIcon className="auth-perk-icon" />
              <span>Veterinary advice, anytime</span>
            </li>
            <li className="auth-perk">
              <PetsIcon className="auth-perk-icon" />
              <span>Care plans tailored to every paw</span>
            </li>
          </ul>
        </div>
      </Box>
    );
  };

  /** RENDER */
  return (
    <>
      {/* SIGNUP MODAL */}
      <Modal
        aria-labelledby="auth-signup-title"
        aria-describedby="auth-signup-description"
        className="auth-modal"
        open={signupOpen}
        onClose={closeSignupModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 400 } }}
      >
        <Fade in={signupOpen}>
          <Stack className="auth-panel" direction={{ xs: "column", md: "row" }}>
            <IconButton
              className="auth-close-btn"
              aria-label="Close signup"
              onClick={closeSignupModal}
            >
              <CloseIcon />
            </IconButton>

            {renderVisualPanel("signup")}

            <Stack className="auth-form-side">
              <div className="auth-chip-row">
                <span className="auth-chip auth-chip--signup">
                  <PersonAddAlt1Icon />
                  Signup
                </span>
              </div>
              <Typography id="auth-signup-title" className="auth-title">
                Join the PetFood family
              </Typography>
              <Typography
                id="auth-signup-description"
                className="auth-subtitle"
              >
                One quick step and your pet&apos;s favourites are on the way.
              </Typography>

              <Stack className="auth-form-fields">
                <TextField
                  label="Username"
                  variant="outlined"
                  value={memberNick}
                  onChange={handleUsername}
                  error={Boolean(fieldErrors.memberNick)}
                  helperText={fieldErrors.memberNick ?? " "}
                  autoComplete="off"
                  slotProps={{
                    htmlInput: {
                      autoComplete: "new-username",
                      autoCorrect: "off",
                      autoCapitalize: "off",
                      spellCheck: false,
                      "data-form-type": "other",
                      "data-lpignore": "true",
                      "data-1p-ignore": "true",
                    },
                  }}
                  fullWidth
                />
                <TextField
                  label="Phone number"
                  variant="outlined"
                  value={memberPhone}
                  onChange={handlePhone}
                  error={Boolean(fieldErrors.memberPhone)}
                  helperText={fieldErrors.memberPhone ?? " "}
                  autoComplete="off"
                  slotProps={{
                    htmlInput: {
                      autoComplete: "new-phone",
                      autoCorrect: "off",
                      autoCapitalize: "off",
                      spellCheck: false,
                      "data-form-type": "other",
                      "data-lpignore": "true",
                      "data-1p-ignore": "true",
                    },
                  }}
                  fullWidth
                />
                <Box className="auth-password-wrap">
                  <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={memberPassword}
                    onChange={handlePassword}
                    onKeyDown={handlePasswordKeyDown}
                    error={Boolean(fieldErrors.memberPassword)}
                    helperText={
                      fieldErrors.memberPassword ??
                      "At least 6 characters, with a letter and a number."
                    }
                    autoComplete="off"
                    slotProps={{
                      htmlInput: {
                        autoComplete: "new-password",
                        autoCorrect: "off",
                        autoCapitalize: "off",
                        spellCheck: false,
                        "data-form-type": "other",
                        "data-lpignore": "true",
                        "data-1p-ignore": "true",
                      },
                    }}
                    fullWidth
                  />
                  <IconButton
                    className="auth-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Box>
              </Stack>

              {errorMessage ? (
                <Typography className="auth-error">{errorMessage}</Typography>
              ) : null}

              <Button
                className="auth-submit-btn auth-submit-btn--signup"
                variant="contained"
                disableElevation
                startIcon={<PersonAddAlt1Icon />}
                onClick={handleSignupRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Create my account"}
              </Button>

              {onSwitchToLogin ? (
                <Typography className="auth-switch">
                  Already part of the pack?{" "}
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={handleSwitchToLogin}
                  >
                    Login instead
                  </button>
                </Typography>
              ) : null}

              <Typography className="auth-footnote">
                By continuing, you agree to PetFood&apos;s care-first ordering
                flow.
              </Typography>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      {/* LOGIN MODAL */}
      <Modal
        aria-labelledby="auth-login-title"
        aria-describedby="auth-login-description"
        className="auth-modal"
        open={loginOpen}
        onClose={closeLoginModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 400 } }}
      >
        <Fade in={loginOpen}>
          <Stack
            className="auth-panel auth-panel--login"
            direction={{ xs: "column", md: "row" }}
          >
            <IconButton
              className="auth-close-btn"
              aria-label="Close login"
              onClick={closeLoginModal}
            >
              <CloseIcon />
            </IconButton>

            {renderVisualPanel("login")}

            <Stack className="auth-form-side auth-form-side--login">
              <div className="auth-chip-row">
                <span className="auth-chip auth-chip--login">
                  <PetsIcon />
                  Login
                </span>
              </div>
              <Typography id="auth-login-title" className="auth-title">
                Welcome back, pet parent
              </Typography>
              <Typography id="auth-login-description" className="auth-subtitle">
                Login to access your orders, saved details, and pet profile.
              </Typography>

              <Stack className="auth-form-fields">
                <TextField
                  label="Username"
                  variant="outlined"
                  value={memberNick}
                  onChange={handleUsername}
                  error={Boolean(fieldErrors.memberNick)}
                  helperText={fieldErrors.memberNick ?? " "}
                  autoComplete="off"
                  slotProps={{
                    htmlInput: {
                      autoComplete: "new-username",
                      autoCorrect: "off",
                      autoCapitalize: "off",
                      spellCheck: false,
                      "data-form-type": "other",
                      "data-lpignore": "true",
                      "data-1p-ignore": "true",
                    },
                  }}
                  fullWidth
                />
                <Box className="auth-password-wrap">
                  <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={memberPassword}
                    onChange={handlePassword}
                    onKeyDown={handlePasswordKeyDown}
                    error={Boolean(fieldErrors.memberPassword)}
                    helperText={fieldErrors.memberPassword ?? " "}
                    autoComplete="off"
                    slotProps={{
                      htmlInput: {
                        autoComplete: "new-password",
                        autoCorrect: "off",
                        autoCapitalize: "off",
                        spellCheck: false,
                        "data-form-type": "other",
                        "data-lpignore": "true",
                        "data-1p-ignore": "true",
                      },
                    }}
                    fullWidth
                  />
                  <IconButton
                    className="auth-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Box>
              </Stack>

              {errorMessage ? (
                <Typography className="auth-error">{errorMessage}</Typography>
              ) : null}

              <Button
                className="auth-submit-btn auth-submit-btn--login"
                variant="contained"
                disableElevation
                startIcon={<LoginIcon />}
                onClick={handleLoginRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              {onSwitchToSignup ? (
                <Typography className="auth-switch">
                  New to PetFood?{" "}
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={handleSwitchToSignup}
                  >
                    Create an account
                  </button>
                </Typography>
              ) : null}

              <Typography className="auth-footnote">
                Your pet care data stays tied to your account for quicker
                checkout.
              </Typography>
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </>
  );
}
