const sendSuccessResponse = ({res, code = 200, message, data}) => {
    return res.status(code).json({
        success: true,
        message: message || "Request success",
        data
    })
}

const sendErrorResponse = ({res, code = 500, message, err}) => {
    console.log(err)
    return res.status(code).json({
        success: false,
        message: message || "Request failed.",
        errorMessage: err?.message || message
    })
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
}