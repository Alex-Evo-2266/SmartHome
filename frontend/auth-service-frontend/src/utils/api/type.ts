
export enum TypeRequest{
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

export interface BaseErrorResponse{
    message: string
}   