import React, { useContext, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite';



function App() {


  const { store } = useContext(Context)


  useEffect(() => {
    if(localStorage.getItem('token')){
        store.checkAuth() // запрос на втоизацию
    }

    console.log(localStorage.getItem('token'), '-аксесс')

  }, [])



  return (
    <div>
      <h1>{ store.isAuth ? `Пользотваел авторизован ${store.user.email}` : "Авторизуйтесь" } </h1>

      <LoginForm />
    </div>
  );
}

export default observer(App);

