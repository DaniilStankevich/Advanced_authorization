const userSevice = require('../service/user-service')


//Функции для каждого адреса
class UseController  {

    async registration (req, res, next) {
        try {

            const {email, password} = req.body
            
            const userData = await userSevice.registration(email, password)

            console.log(userData, '- что возращает сама функция')

            res.cookie('refreshtoken',  userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true} )
            return res.json(userData)

        } catch(e) {
            console.log(e)
        }

    }


    async login(req, res, next) {
        try {


        } catch(e) {
            console.log(e)
        }

    }


    async logout(req, res, next) {
        try {


        } catch(e) {
            console.log(e)
        }

    }


    async activate(req, res, next) {
        try {


        } catch(e) {
            console.log(e)
        }

    }


    async refresh(req, res, next) {
        try {


        } catch(e) {
            console.log(e)
        }

    }


    async getUsers(req, res, next) {
        try {
            res.json(['123', '456'])
        } catch(e) {
            console.log(e)
        }

    }
}

module.exports = new UseController()
