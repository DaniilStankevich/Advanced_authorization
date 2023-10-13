const Router = require("express").Router
const router = new Router()
const useController = require("../controllers/use-controller")
const { body } = require("express-validator")
const acthMiddleware = require("../middlewares/auth-middleware")

//Роуты
router.post( "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  useController.registration
)

router.post("/login", useController.login)
router.post("/logout", useController.logout)
router.get("/activate/:link", useController.activate)         // активация аккаунта по ссылке
router.get("/refresh", useController.refresh)                 // перезапись access в случае истечение его жизни
router.get("/users", acthMiddleware, useController.getUsers)  // end-point test для авторизованных пользователей

module.exports = router
