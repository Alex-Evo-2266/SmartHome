import React, { useEffect } from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Alert} from './components/alert/alert.js'
import {DialogWindow} from './components/dialogWindow/dialogWindow.js'
import {Menu} from './components/Menu/menu.js'
import {Form} from './components/Form/form'
import {AlertState} from './components/alert/alertState'
import {FormState} from './components/Form/formState'
import {TerminalState} from './components/terminal/terminalState'
import {useRoutes} from './routes.js'
import {CastomizeStyle} from './components/UserStyle/StyleState.js'
import {GroupsState} from './components/Groups/groupsState.js'
import {TerminalCart} from './components/terminal/terminalCart'
import {SocketState} from './hooks/socket.hook.js'
import {TypesDeviceState} from './components/typeDevices/typeDevicesState'
import { useSelector } from 'react-redux';

import './css/style-auth.css'
import './icon/css/all.css'
import './css/style-alert.css'
import './css/style-components.css'

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
    <SocketState>
    <AlertState>
    <CastomizeStyle token={data.token} ready={true}>
    <TypesDeviceState token={data.token} ready={true}>
    <GroupsState token={data.token}>
    <FormState>
    <TerminalState>

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

    </TerminalState>
    </FormState>
    </GroupsState>
    </TypesDeviceState>
    </CastomizeStyle>
    </AlertState>
    </SocketState>
  );
}

export default App;
