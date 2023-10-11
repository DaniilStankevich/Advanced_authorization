const ApiError = require('../exceptions/api-error')
const tokenSevice = require('../service/token-service')


module.exports = function(req, res, next) {
    console.log(req, 'Проверка')

    try {
        // Вытаскивание токена из заголовка 


        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) {
            return next(ApiError.UnavthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) {
            return next(ApiError.UnavthorizedError())
        }

        // Если токен есть то валадируем 
        const userData = tokenSevice.validateAccessToken(accessToken)
        if(!userData) {
            return next(ApiError.UnavthorizedError())
        }


        req.user = userData 
        next()


    } catch(e) { 
        console.log(e)
        return next(ApiError.UnavthorizedError())
    }
}