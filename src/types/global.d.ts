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
        createdAt: Date;
        role: {
            id: string;
            name: string;
        };
        active: boolean;
    }

    interface IBookTable {
        id: string;
        category: string;
        title: string;
        author: string;
        publisher: string;
        thumb: string;
        description: string;
        quantity: number;
        status: string;
        active: boolean;
        createdAt: Date;
        createdBy: string;
        updatedAt: Date;
        updatedBy: string;
    }

    interface IBorrowTable {
        id: string;
        status: string;
        book: IBook;
        user: IUser;
        updatedAt: Date;
    }

    interface IBook {
        id: string;
        category: string;
        title: string;
        author: string;
        publisher: string;
        thumb: string;
        description: string;
        quantity: number;
        status: string;
        active: boolean;
        createdAt: Date;
        createdBy: string;
        updatedAt: Date;
        updatedBy: string;
    }

    interface IGetAccount {
        user: IUser;
    }

    interface IActivityLogTable {
        executionTime: Date;
        username: string;
        activeType: string;
        description: [];
    }

    interface ICart {
        id: string;
        quantity: number;
        user: IUser;
        details: IBookTable;
    }

    interface IBorrow {
        username: string;
        details: IBookTable;
    }

    interface IResponseImport {
        countSuccess: number;
        countError: number;
        detail: any;
    }

    interface IMaintenance {
        inMaintenance: boolean;
        from: Date;
    }
}