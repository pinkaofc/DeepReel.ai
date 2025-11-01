let userApiKey: string | null = null;

/**
 * Stores a user-provided API key for the current session.
 * @param key The API key string.
 */
export const setApiKey = (key: string): void => {
    userApiKey = key;
};

/**
 * Retrieves the currently active API key.
 * It prioritizes the user-provided key, then falls back to the one
 * from the environment (e.g., from the platform's key selector).
 * @returns The API key string or null if none is available.
 */
export const getApiKey = (): string | null => {
    // Return the user-pasted key if it exists, otherwise fall back to the environment key.
    return userApiKey || process.env.API_KEY || null;
};
