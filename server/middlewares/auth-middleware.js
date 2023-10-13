const ApiError = require("../exceptions/api-error")
const tokenService = require("../service/token-service")

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    console.log(req.headers)
    if (!authorizationHeader) {
      return next(ApiError.UnavthorizedError())
    }

    const accessToken = authorizationHeader.split(" ")[1]
    if (!accessToken) {
      return next(ApiError.UnavthorizedError())
    }

    // Если токен есть то валадируем
    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      console.log("Ошибка последняя")
      return next(ApiError.UnavthorizedError())
    }

    req.user = userData
    next()
  } catch (e) {
    console.log(e)
    return next(ApiError.UnavthorizedError())
  }
}
