import React, { FC, useState , useContext} from 'react'
import { Context } from '../index'
import { observer } from 'mobx-react-lite';

const LoginForm: FC = () => {

    const [email, setEmail] = useState<string>('user@mail.ru')
    const [password, setPassword] = useState<string>('12345')

    const { store } = useContext(Context)

  return (
    <div>
        <input type="text" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)} />

        <button onClick={() => store.login(email, password)}> Логин</button>
        <button  onClick={() => store.registration(email, password)}>Регистрация</button>


    </div>
  )


}



export default observer(LoginForm)