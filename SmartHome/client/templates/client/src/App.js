import React,{useEffect,useState,useCallback} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Alert} from './components/alert/alert.js'
import {Menu} from './components/verticalMenu/menu.js'
import {Form} from './components/Form/form'
import {AlertState} from './components/alert/alertState'
import {MenuState} from './components/verticalMenu/menuState'
import {FormState} from './components/Form/formState'
import {TerminalState} from './components/terminal/terminalState'
import {AddScriptState} from './components/addScript/addScriptState'
import {useRoutes} from './routes.js'
import {useAuth} from './hooks/auth.hook.js'
import {useBackground} from './hooks/background.hook.js'
import {useHttp} from './hooks/http.hook'
import {AuthContext} from './context/AuthContext'
import {TerminalCart} from './components/terminal/terminalCart'
import {UserContext} from './context/UserContext'
import {ServerConfigContext} from './context/ServerConfigContext'
import {SocketState} from './hooks/socket.hook.js'
import './css/style-auth.css'
import './icon/css/all.min.css'
import './css/style-alert.css'
import './css/style-components.css'

function App() {
  const {token, login, logout, userId, userLevel,ready} = useAuth();
  const {request, error, clearError} = useHttp();
  const {updataBackground} = useBackground(token);
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated,userLevel);
  const [config, setConfig] = useState({})
  const [serverConfig, setServerConfig] = useState({})

  const userConfig = useCallback(async()=>{
    if(!token)
      return updataBackground()
    const data = await request(`/api/user/config`, 'GET', null,{Authorization: `Bearer ${token}`})
    const serverData = await request(`/api/server/data`, 'GET', null,{Authorization: `Bearer ${token}`})
    console.log(serverData);
    updataBackground(token,data)
    setConfig(data)
    setServerConfig(serverData)
  },[token,request,updataBackground])

  const updatebackground = ()=>{
    userConfig()
  }

  useEffect(()=>{
    if(ready){
      userConfig()
    }
  },[ready,userConfig])

  useEffect(()=>{
    if(error)
      console.error(error);
    return ()=>{
      clearError();
    }
  },[error, clearError])

  if (!ready) {
    return(
      <h1>Loding</h1>
    )
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, userLevel, isAuthenticated
    }}>
    <UserContext.Provider value={{...config,updateBackground:updatebackground}}>
    <ServerConfigContext.Provider value={{...serverConfig}}>
    <SocketState>
    <AlertState>
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
    </AlertState>
    </SocketState>
    </ServerConfigContext.Provider>
    </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
