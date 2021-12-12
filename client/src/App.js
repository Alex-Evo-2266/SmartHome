import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Alert} from './components/alert/alert.js'
import {DialogWindow} from './components/dialogWindow/dialogWindow.js'
import {Menu} from './components/Menu/menu.js'
import {Form} from './components/Form/form'
import {AlertState} from './components/alert/alertState'
import {DialogWindowState} from './components/dialogWindow/dialogWindowState'
import {MenuState} from './components/Menu/menuState'
import {FormState} from './components/Form/formState'
import {TerminalState} from './components/terminal/terminalState'
import {AddScriptState} from './components/addScript/addScriptState'
import {useRoutes} from './routes.js'
import {useAuth} from './hooks/auth.hook.js'
import {CastomizeStyle} from './components/UserStyle/StyleState.js'
import {AuthContext} from './context/AuthContext'
import {TerminalCart} from './components/terminal/terminalCart'
import {SocketState} from './hooks/socket.hook.js'
import {TypesDeviceState} from './components/typeDevices/typeDevicesState'
import './css/style-auth.css'
import './icon/css/all.css'
import './css/style-alert.css'
import './css/style-components.css'

function App() {
  const {token, login, logout, userId, userLevel,ready} = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated,userLevel);

  if (!ready) {
    return(
      <h1>Loding</h1>
    )
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, userLevel, isAuthenticated
    }}>
    <MenuState>
    <SocketState>
    <AlertState>
    <DialogWindowState>
    <CastomizeStyle token={token} ready={ready}>
    <TypesDeviceState token={token} ready={ready}>
    <FormState>
    <TerminalState>
    <AddScriptState>

    <BrowserRouter>
      <div className="App">
        <DialogWindow/>
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
    </TypesDeviceState>
    </CastomizeStyle>
    </DialogWindowState>
    </AlertState>
    </SocketState>
    </MenuState>
    </AuthContext.Provider>
  );
}

export default App;
