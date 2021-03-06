import React,{useEffect} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Alert} from './components/alert/alert.js'
import {Menu} from './components/verticalMenu/menu.js'
import {Form} from './components/Form/form'
import {AlertState} from './components/alert/alertState'
import {MenuState} from './components/verticalMenu/menuState'
import {FormState} from './components/Form/formState'
import {SocketState} from './hooks/socket.hook'
import {TerminalState} from './components/terminal/terminalState'
import {AddScriptState} from './components/addScript/addScriptState'
import {useRoutes} from './routes.js'
import {useAuth} from './hooks/auth.hook.js'
import {useBackground} from './hooks/background.hook.js'
import {AuthContext} from './context/AuthContext'
import {TerminalCart} from './components/terminal/terminalCart'
import './css/style-auth.css'
import './icon/css/all.min.css'
import './css/style-alert.css'
import './css/style-components.css'

function App() {
  const {token, login, logout, userId, userLevel,ready,socket} = useAuth();
  const {updataBackground} = useBackground(token);
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated,userLevel);

  useEffect(()=>{
    if(ready)
    updataBackground(token)
  },[ready,token,updataBackground])

  if (!ready) {
    return(
      <h1>Loding</h1>
    )
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, userLevel, isAuthenticated,socket
    }}>
    <AlertState>
    <SocketState>
    <MenuState>
    <FormState>
    <TerminalState>
    <AddScriptState>

    <BrowserRouter>
      <div className="App">
        <Alert/>
        <Form/>
        <TerminalCart/>
        {(isAuthenticated)?<Menu/>:null}
        {routes}
      </div>
    </BrowserRouter>

    </AddScriptState>
    </TerminalState>
    </FormState>
    </MenuState>
    </SocketState>
    </AlertState>
    </AuthContext.Provider>
  );
}

export default App;
