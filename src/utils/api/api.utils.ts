export const apiSuccessResponse = (data: any, statusCode = 200) => {
    return {
        error: false,
        statusCode,
        data,
    };
};

export const apiFailedResponse = (error: any, statusCode = 500) => {
    return {
        error: true,
        statusCode,
        error_details: error,
    };
};
