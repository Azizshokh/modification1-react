/** SweetAlertHandling — brand-styled wrappers around sweetalert2 **/
import Swal from "sweetalert2";
import axios from "axios";
import { Messages } from "./config";

/** Brand-aware defaults applied to every dialog. */
const brandPopup = {
    customClass: {
        popup: "petfood-popup",
        confirmButton: "swal2-confirm petfood-confirm",
    },
    buttonsStyling: false,
};

const brandToast = {
    toast: true as const,
    position: "top-end" as const,
    showConfirmButton: false,
    timerProgressBar: true,
    customClass: { popup: "petfood-toast" },
};

/** Show a brand-styled error dialog for unexpected/server errors.
 *  Silently ignores expected 401/403 auth noise (callers handle those). */
export const sweetErrorHandling = async (err: any) => {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
            console.info("[sweetAlert] auth error suppressed:", status);
            return;
        }
    }
    const error = err?.response?.data ?? err;
    const message = error?.message ?? Messages.error1;
    await Swal.fire({
        ...brandPopup,
        icon: "error",
        text: message,
        showConfirmButton: false,
        timer: 2500,
    });
};

export const sweetTopSuccessAlert = async (
    msg: string,
    duration: number = 2000,
) => {
    await Swal.fire({
        ...brandPopup,
        position: "top-end",
        icon: "success",
        title: msg,
        showConfirmButton: false,
        timer: duration,
    });
};

export const sweetTopSmallSuccessAlert = async (
    msg: string,
    duration: number = 2000,
) => {
    const Toast = Swal.mixin({
        ...brandToast,
        timer: duration,
    });

    Toast.fire({
        icon: "success",
        title: msg,
    }).then();
};

export const sweetFailureProvider = (
    msg: string,
    show_button: boolean = false,
    forward_url: string = "",
) => {
    Swal.fire({
        ...brandPopup,
        icon: "error",
        title: msg,
        showConfirmButton: show_button,
        confirmButtonText: "OK",
    }).then(() => {
        if (forward_url !== "") {
            window.location.replace(forward_url);
        }
    });
};

