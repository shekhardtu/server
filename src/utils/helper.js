const responseObj = (send, status) => {
    return {
        data: send,
        status: status && 'Success'
    }

}


module.exports = { responseObj };