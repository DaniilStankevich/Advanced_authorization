// Реалзиация моего класса для ошибок

// Этот класс расширяет дефолтный класс "Error"
module.exports = class ApiError extends Error {

    status
    errors
    

    constructor(status, message, errors) {
        super(message)
        this.status = status
        this.errors = errors
    }


    static UnavthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(410, message, errors )
    }

}