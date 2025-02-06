import axios from "axios";
import { Mutex } from "async-mutex";
interface AccessTokenResponse {
    access_token: string;
}
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true
});

const mutex = new Mutex();

const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get<IBackendRes<AccessTokenResponse>>('/api/v1/auth/refresh');
        if (res && res.data) {
            return res.data.access_token;
        }
        return null;
    });
};

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) {
        return response.data;
    }
    return response;
}, async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.config && error.response && error.response.status === 401) {
        const access_token = await handleRefreshToken();
        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem('access_token', access_token)
            return instance.request(error.config);
        }
    }

    if (error && error.response && error.response.data) {
        return error.response.data;
    }
    return Promise.reject(error);
});

export default instance;