import React, { useEffect } from 'react'
import {BrowserRouter} from 'react-router-dom'
import {Alert} from './components/alerts/alert.js'
import {Menu} from './components/menu/menu.js'
import {useRoutes} from './routes.js'
import { useSelector } from 'react-redux';
import { DialogWindow } from './components/messageDialog/dialogWindow.js'
import { useStyle } from './hooks/style.hook.js'

import './css/style-auth.css'
import './icon/css/all.css'
import './css/style-alert.css'
import './css/style-components.css'
import { useUser } from './hooks/user.hook.js'

function App() {
  const data = useSelector(state => state.auth)
  const routes = useRoutes(data.isAuthenticated,data.role);
  const {loadStyle, avtoNightStyle, adaptiveBackground} = useStyle()
  const {loadData} = useUser()

  useEffect(()=>{
    if (data.isAuthenticated)
      loadStyle()
  },[loadStyle, data.isAuthenticated])

  useEffect(()=>{
    if (data.isAuthenticated)
      loadData()
  },[loadData, data.isAuthenticated])

  useEffect(()=>{
    adaptiveBackground()
    avtoNightStyle()
  },[adaptiveBackground, avtoNightStyle])

  

  return (
    <BrowserRouter>
      <div className="App">
        <DialogWindow/>
        <Alert/>
        {(data.isAuthenticated)?<Menu/>:null}
        {routes}
      </div>
    </BrowserRouter>
  );
}

export default App;
