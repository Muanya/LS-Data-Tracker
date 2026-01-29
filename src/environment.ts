export const environment = {
    BASE_API_URL: import.meta.env.VITE_BASE_API_URL || 'http://localhost:4000/api',
    AUTH_PASSPHRASE: import.meta.env.VITE_AUTH_PASSPHRASE || 'password123'
};