type TBaseResponse = {
    success: boolean;
    message?: string;
};

export type TSuccessResponse<Data = Record<string, any>> = TBaseResponse & {
    success: true;
    data: Data;
};

export type TErrorResponse<Error = any> = TBaseResponse & {
    success: false;
    error: Error;
};

export type TDynamicResponse<
    Data = Record<string, any>,
    Error = any
> = TSuccessResponse<Data> | TErrorResponse<Error>

export type ExtractSuccessResponse<T> = T extends TSuccessResponse<infer D> ? D : never;
export type ExtractErrorResponse<T> = T extends TErrorResponse<infer E> ? E : never;

export type TAPIResponse<T = Record<string, any>> = {
    success: boolean;
    message?: string;
    error?: Record<string, any>,
    data?: T;
};

interface TPaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type TPaginatedResponse<T = Record<string, any>> =
    TAPIResponse<TPaginatedResult<T>>

