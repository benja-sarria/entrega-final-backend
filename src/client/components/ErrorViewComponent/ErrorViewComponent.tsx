export const ErrorViewComponent = ({
    errorResponse,
}: {
    errorResponse: any;
}) => {
    return (
        <div>
            <h1>Error - {`${errorResponse.error}`}</h1>
            <h2>Status Code: {`${errorResponse.statusCode}`}</h2>
            <h3>Details: {`${errorResponse.error_details.message}`}</h3>
        </div>
    );
};
