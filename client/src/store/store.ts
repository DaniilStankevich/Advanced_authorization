import { makeAutoObservable } from "mobx";
import { IUser } from "../models/User";
import AuthService from "../services/AuthService";

export default class Store {

    user = {} as IUser;
    isAuth = false


    constructor() {
        makeAutoObservable(this)
    }


    setAuth(bool: boolean) {
        this.isAuth = bool
    }


    setUser(user: IUser) {
        this.user = user
    }



    async login( email: string, password: string) {
        try {

            const response = await AuthService.login(email, password)
            localStorage.setItem('token', response.data.accessToken)

            this.setAuth(true)
            this.setUser(response.data.user)

        } catch (e: any) {
            console.log( e.response?.data.message)
        }
    }


    async registration( email: string, password: string) {
        try {

            const response = await AuthService.registration(email, password)
            localStorage.setItem('token', response.data.accessToken)

            this.setAuth(true)
            this.setUser(response.data.user)

        } catch (e: any) {
            console.log( e.response?.data.message)
        }
    }



    async logout( email: string, password: string) {
        try {

            const response = await AuthService.registration(email, password)
            localStorage.removeItem('token')

            this.setAuth(false)
            this.setUser({} as IUser)

        } catch (e: any) {
            console.log( e.response?.data.message)
        }
    }


}