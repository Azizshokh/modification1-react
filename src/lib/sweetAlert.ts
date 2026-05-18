import axios from "axios";

/**
 * Lightweight error reporter used by UI handlers.
 * 401/403 are EXPECTED auth outcomes (wrong password, no session, etc.),
 * so we log them as info instead of error to keep the browser console clean.
 */
export const sweetErrorHandling = async (err: unknown): Promise<void> => {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
            console.info("[auth] request not authorized:", status);
            return;
        }
        const serverMsg =
            (err.response?.data as { message?: string } | undefined)?.message ??
            err.message;
        console.warn("[sweetErrorHandling]", status ?? "network", serverMsg);
        return;
    }

    const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
    console.warn("[sweetErrorHandling]", message);
};
