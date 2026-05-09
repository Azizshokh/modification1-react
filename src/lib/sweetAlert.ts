export const sweetErrorHandling = async (err: unknown): Promise<void> => {
    const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[sweetErrorHandling]", message);
};
