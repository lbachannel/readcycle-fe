export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface IRegister {
        id: string;
        name: string;
        email: string;
        verificationEmailToken: string;
    }

    interface ILogin {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: {
                id: string;
                name: string;
                permissions: {
                    id: string;
                    name: string;
                    apiPath: string;
                    method: string;
                    module: string;
                }[]
            }
        }
    }

    interface IUser {
        id: string;
        email: string;
        name: string;
        role: {
            id: string;
            name: string;
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    }

    interface IUserTable {
        id: string;
        email: string;
        name: string;
        dateOfBirth: Date;
        role: {
            id: string;
            name: string;
        }
    }

    interface IGetAccount {
        user: IUser;
    }
}