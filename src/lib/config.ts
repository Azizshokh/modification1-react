import axios from "axios";

axios.defaults.withCredentials = true;

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

export const serverApi: string = trimTrailingSlash(
    process.env.REACT_APP_API_URL || window.location.origin
);

export const toAssetUrl = (path?: string | null): string => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("blob:") || path.startsWith("data:")) return path;

    const normalizedPath = path.replace(/^\/+/, "");
    return `${serverApi}/${normalizedPath}`;
};

export const Messages = {
    error1: "Something went wrong!!!",
    error2: "Please login first!!!",
    error3: "Please fulfill all inputs!!!",
    error4: "Message is empty!!!",
    error5: "Only images with jpeg, jpg, png format allowed!!!",
};
