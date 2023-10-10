const ApiError = require('../exceptions/api-error')

module.exports = function (err, req, res, next) {

    console.log('Функция ошибки')

    // Проверка: является ли "err" экземпляр класса "ApiError"
    if(err instanceof ApiError ) {
        console.log('Функция ошибки')

        return res.status(err.status).json({
            message: err.message,
            errors: err.errors,
              // Добавьте свойство status в ответ
        });
    }

    // В случае не предусмотренной ошибки
    return res.status(500).json({message: 'Непредвиденная ошибка'})


}