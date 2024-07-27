const response = (statusCode, datas, message, res) => {
    res.status(statusCode).json({
        payload: {
            status_Code: statusCode,
            datas: datas,
            message: message
        },
        pagination: {
            prev: "",
            next: "",
            max: "",
        }
    })
}

module.exports = response