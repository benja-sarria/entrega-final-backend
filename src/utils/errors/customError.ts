export class CustomError {
    status: number;
    message: string;
    details?: string;
    constructor(
        statusCode: number,
        description: string,
        errorDetails?: string
    ) {
        this.status = statusCode;
        this.message = description;
        this.details = errorDetails;
    }
}
