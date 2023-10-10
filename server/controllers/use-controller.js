const userSevice = require('../service/user-service')


//Функции для каждого адреса
class UseController  {

    async registration (req, res, next) {
        try {

            const {email, password} = req.body
           // console.log('Функция регистрации')


            const userData = await userSevice.registration(email, password)
            //console.log(userData, '- что возращает сама функция')


            console.log('Выполнение недопустимо ')
            res.cookie('refreshtoken',  userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true} )
            return res.json(userData)

        } catch(e) {
            console.log(e, 'Глядим на ошибку')
            next(e)
        }

    }


    async login(req, res, next) {
        try {


        } catch(e) {
            next(e)
        }

    }


    async logout(req, res, next) {
        try {


        } catch(e) {
            next(e)
        }

    }


    async activate(req, res, next) {
        try {

            const activationLink = req.params.link
            await userSevice.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL); // API_URL-сервер, CLIENT_URL-клиент

        } catch(e) {
            next(e)
        }


    }


    async refresh(req, res, next) {
        try {


        } catch(e) {
            next(e)
        }

    }


    async getUsers(req, res, next) {
        try {
            res.json(['123', '456'])
        } catch(e) {
            next(e)
        }

    }
}

module.exports = new UseController()
