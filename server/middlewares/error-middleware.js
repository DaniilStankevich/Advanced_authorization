const ApiError = require('../exceptions/api-error')

module.exports = function (err, req, res, next) {

    console.log(err)

    //Проверка: является ли "err" экземпляром класса "ApiError"
    if(err instanceof ApiError ) {

        return res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
    }

    //В случае не предусмотренной ошибки
    return res.status(500).json({message: 'Непредвиденная ошибка'})


}