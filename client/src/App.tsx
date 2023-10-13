import React, { useContext, useEffect, useState } from "react"
import LoginForm from "./components/LoginForm"
import { Context } from "."
import { observer } from "mobx-react-lite"
import { IUser } from "./models/User"
import UserService from "./services/UserService"

function App() {
  const { store } = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth() // запрос на втоизацию
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
        <button onClick={getUsers}>Получтить пользователей</button>
      </>
    )
  }

  return (
    <div>
      <h1>
        {store.isAuth
          ? `Пользотватель авторизован ${store.user.email}`
          : "Авторизуйтесь"}{" "}
      </h1>
      <h1>
        {store.user.isActivated
          ? "Aккаунт подтверджен по почте"
          : "Подтвердите аккаунт"}
      </h1>

      <button onClick={() => store.logout()}>Выйти</button>

      <div>
        <button onClick={getUsers}>Получтить пользователей</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  )
}

export default observer(App)
