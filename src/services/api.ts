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
    const urlBackend = `/api/v1/admin/books?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend, {
        headers: { delay: 100 }
    });
}

export const getAllBooksClientAPI = (query: string) => {
    const urlBackend = `/api/v1/books?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend, {
        headers: { delay: 100 }
    });
}

export const toggleSoftDeleteAPI = (id: string) => {
    const urlBackend = `/api/v1/admin/books/${id}`;
    return axios.put<IBackendRes<IBookTable>>(urlBackend);
}

export const createBookAPI = (
    category: string, title: string, author: string, publisher: string, 
    thumb: string, description: string, quantity: number, status: string) => {
    const urlBackend = "/api/v1/admin/books";
    return axios.post<IBackendRes<IBook>>(urlBackend, {
        category, title, author, publisher, thumb, description, quantity, status
    })
}

export const updateBookAPI = (
    id: string, category: string, title: string, author: string, publisher: string,
    thumb: string, description: string, quantity: number, status: string) => {
    const urlBackend = "/api/v1/admin/books";
    return axios.put<IBackendRes<IBook>>(urlBackend, {
        id, category, title, author, publisher, thumb, description, quantity, status
    })
}

export const deleteBookAPI = (id: string) => {
    const urlBackend = `/api/v1/admin/books/${id}`;
    return axios.delete<IBackendRes<IBook>>(urlBackend);
}

export const uploadFileAPI = (file: any) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    return axios<IBackendRes<{fileUploaded: string}>>({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data"
        },
    });
}

export const deleteThumbAPI = (file: string) => {
    const urlBackend = `/api/v1/file/delete/${file}`;
    return axios.delete<IBackendRes<String>>(urlBackend);
}