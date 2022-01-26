const ApiError = require("../error/ApiError")

function ErrorMiddleware(error, req, res, next) {
    if (error instanceof ApiError) {
        console.error(`Status code: ${error.status}\n${error.message}`)
        return res.status(error.status).json({ error: error.message })
    }
    console.error('Unexpected error\n', error)
    return res.status(500).json({ msg: 'Unexpected error' })
}

module.exports = ErrorMiddleware