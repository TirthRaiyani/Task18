class ApiError extends Error {
    constructor(
        stausCode,
        data,
        message = "something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = stausCode;
        this.data = data;
        this.message = message;
        this.success = false;
        this.error = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.consturctor);
        }
    }
}

module.exports = ApiError