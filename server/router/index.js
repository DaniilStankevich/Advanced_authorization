const Router = require('express').Router
const router = new Router()
const useController = require('../controllers/use-controller')

//Роуты
router.post('/registration',   useController.registration)
router.post('/login', useController.login )
router.post('/logout', useController.logout) 

router.get('/activate/:link', useController.activate) // активация аккаунта по ссылке
router.get('/refresh', useController.refresh)         // перезапись access в случае истечение его жизни
router.get('/users', useController.getUsers)          // end-point test для авторизованных пользователей


module.exports = router