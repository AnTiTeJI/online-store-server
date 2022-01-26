class ApiError extends Error {
    constructor(status, msg) {
        super(msg)
        this.status = status
    }
    static badRequest = (msg = 'Bad request') => { return new ApiError(400, msg) }
    static unathorized = (msg = 'Unathorized') => { return new ApiError(401, msg) }
    static forbidden = (msg = 'Forbidden') => { return new ApiError(403, msg) }
    static notFound = (msg = 'Not found') => { return new ApiError(404, msg) }
    static internalServerError = (msg = 'Internal server error') => { return new ApiError(500, msg) }
}

module.exports = ApiError