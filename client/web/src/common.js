export const API_URL = 'https://apidev.auramaze.org';
export const API_ENDPOINT = 'https://apidev.auramaze.org/v1';
export const removeCookies = (cookies) => {
    cookies.remove('id', {path: '/'});
    cookies.remove('username', {path: '/'});
    cookies.remove('token', {path: '/'});
};
