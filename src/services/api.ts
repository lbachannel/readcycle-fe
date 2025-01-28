import axios from 'services/axios.customize';

export const registerAPI = (firstName: string, lastName: string, email: string, dateOfBirth: string, password: string, confirmPassword: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { firstName, lastName, email, dateOfBirth, password, confirmPassword })
}

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password })
}