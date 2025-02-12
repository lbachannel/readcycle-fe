import axios from 'services/axios.customize';

// Module auth
export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password })
}

export const getAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IGetAccount>>(urlBackend);
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend);
}

// Module users
export const registerAPI = (firstName: string, lastName: string, email: string, dateOfBirth: string, password: string, confirmPassword: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { firstName, lastName, email, dateOfBirth, password, confirmPassword })
}

export const getAllUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

export const createUserAPI = (firstName: string, lastName: string, email: string, dateOfBirth: string, password: string, confirmPassword: string, role: string) => {
    const urlBackend = "/api/v1/users";
    return axios.post<IBackendRes<IUser>>(urlBackend, { firstName, lastName, email, dateOfBirth, password, confirmPassword, role });
}

export const updateUserAPI = (id: string, name: string, email: string, dateOfBirth: string, role: string) => {
    const urlBackend = "/api/v1/users";
    return axios.put<IBackendRes<IUser>>(urlBackend, { id, name, email, dateOfBirth, role });
}

export const deleteUserAPI = (id: string) => {
    const urlBackend = `/api/v1/users/${id}`;
    return axios.delete<IBackendRes<IUser>>(urlBackend);
}

// Module books
export const getAllBooksAPI = (query: string) => {
    const urlBackend = `/api/v1/books?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
}