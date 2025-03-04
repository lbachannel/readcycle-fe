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

export const changePasswordAPI = (username: string, password: string, newPassword: string, confirmNewPassword: string) => {
    const urlBackend = "/api/v1/auth/change-password";
    return axios.post<IBackendRes<String>>(urlBackend, { username, password, newPassword, confirmNewPassword })
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

export const createUserAPI = (firstName: string, lastName: string, email: string, dateOfBirth: string, role: string) => {
    const urlBackend = "/api/v1/users";
    return axios.post<IBackendRes<IUser>>(urlBackend, { firstName, lastName, email, dateOfBirth, role });
}

export const updateUserAPI = (id: string, name: string, email: string, dateOfBirth: string, role: string) => {
    const urlBackend = "/api/v1/users";
    return axios.put<IBackendRes<IUser>>(urlBackend, { id, name, email, dateOfBirth, role });
}

export const deleteUserAPI = (id: string) => {
    const urlBackend = `/api/v1/users/${id}`;
    return axios.delete<IBackendRes<IUser>>(urlBackend);
}

export const toggleSoftDeleteUserAPI = (id: string) => {
    const urlBackend = `/api/v1/users/${id}`;
    return axios.put<IBackendRes<IUserTable>>(urlBackend);
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

// upgrade
export const getAllBooksClientV2API = (query: string) => {
    const urlBackend = `/api/v2/books?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend)
}

export const getAllBooksHistoryAPI = (query: string) => {
    const urlBackend = `/api/v1/history?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBorrowTable>>>(urlBackend)
}

export const returnBookAPI = (id: string, book: IBook, status: string, user: IUser) => {
    const urlBackend = `/api/v1/return-book`;
    return axios.put<IBackendRes<IBorrowTable>>(urlBackend, {id, book, status, user});
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

export const getBookByIdAPI = (id: string) => {
    const urlBackend = `/api/v1/books/${id}`;
    return axios.get<IBackendRes<IBookTable>>(urlBackend, {
        headers: {
            delay: 100
        }
    });
}

export const bulkCreateBooksAPI = (data: {
    title: string;
    category: string;
    author: string;
    publisher: string;
    quantity: number;
    status: string;
    active: boolean;
}[]) => {
    const urlBackend = "/api/v1/books/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
}

// Activity log
export const getAllActivityLogAPI = (query: string) => {
    const urlBackend = `/api/v1/admin/activity-log?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IActivityLogTable>>>(urlBackend, {
        headers: { delay: 100 }
    });
}

// Add to cart
export const addToCartAPI = (
    id: string, category: string, title: string, author: string, publisher: string,
    thumb: string, description: string, quantity: number, status: string,
    active: boolean) => {
    const urlBackend = "/api/v1/add-to-cart";
    return axios.post<IBackendRes<ICart>>(urlBackend, {
        id, category, title, author, publisher, thumb, description, quantity, status,
        active
    })
}

export const getCartsAPI = () => {
    const urlBackend = "/api/v1/carts";
    return axios.get<IBackendRes<ICart>>(urlBackend);
}

export const deleteCartAPI = (id: string) => {
    const urlBackend = `/api/v1/carts/${id}`;
    return axios.delete<IBackendRes<String>>(urlBackend);
}

export const createBorrowBookAPI = (username: string, details: any) => {
    const urlBackend = "/api/v1/borrow";
    return axios.post<IBackendRes<IBorrow>>(urlBackend, {
        username, details
    });
}

export const deleteCartsAPI = (ids: any) => {
    const urlBackend = "/api/v1/remove-carts";
    return axios.post<IBackendRes<String>>(urlBackend, ids);
}
