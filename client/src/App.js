import React, { useEffect } from 'react'
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
import {CastomizeStyle} from './components/UserStyle/StyleState.js'
import {GroupsState} from './components/Groups/groupsState.js'
import {AuthContext} from './context/AuthContext'
import {TerminalCart} from './components/terminal/terminalCart'
import {SocketState} from './hooks/socket.hook.js'
import {TypesDeviceState} from './components/typeDevices/typeDevicesState'
import {PageState} from './components/Menu/pageState'
import { useSelector } from 'react-redux';

import './css/style-auth.css'
import './icon/css/all.css'
import './css/style-alert.css'
import './css/style-components.css'

import { LOAD } from './store/types.js'

function App() {
  const data = useSelector(state => state.auth)
  const routes = useRoutes(data.isAuthenticated,data.role);

  console.log(data)

  // if (!ready) {
  //   return(
  //     <h1>Loding</h1>
  //   )
  // }

  return (
    <PageState token={data.token}>
    <MenuState>
    <SocketState>
    <AlertState>
    <DialogWindowState>
    <CastomizeStyle token={data.token} ready={true}>
    <TypesDeviceState token={data.token} ready={true}>
    <GroupsState token={data.token}>
    <FormState>
    <TerminalState>
    <AddScriptState>

    <BrowserRouter>
      <div className="App">
        <DialogWindow/>
        <Alert/>
        <Form/>
        <TerminalCart/>
        {(data.isAuthenticated)?<Menu/>:null}
        {routes}
      </div>
    </BrowserRouter>

    </AddScriptState>
    </TerminalState>
    </FormState>
    </GroupsState>
    </TypesDeviceState>
    </CastomizeStyle>
    </DialogWindowState>
    </AlertState>
    </SocketState>
    </MenuState>
    </PageState>
  );
}

export default App;
