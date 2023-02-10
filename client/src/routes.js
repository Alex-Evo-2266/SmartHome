import React, { useEffect } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {HomePage} from './Page/HomePage/HomePage'
import {AuthPage} from './Page/AuthPage/AuthPage'
import { SettingsPage } from './Page/Settings/SettingsPage'
import { ProfilePage } from './Page/ProfilePage/ProfilePage'
import { EditProfilePage } from './Page/ProfilePage/EditProfile'
import { EditPasswordPage } from './Page/ProfilePage/EditPassword'
import { UsersPage } from './Page/UsersPage/UsersPage'
import { NonePage } from './Page/NonePage/NonePage'
import { AddUser } from './Page/UsersPage/AddUserPage'
import { DevicePage } from './Page/DevicePages/DevicePage'
import { AddDevicePage } from './Page/DevicePages/AddDevicePage'
import { useSocket } from './hooks/socket.hook'
import { EditDevicePage } from './Page/DevicePages/EditDevicepage'
import { ScriptPage } from './Page/ScriptPage/ScriptPage'
import { AddScriptPage } from './Page/ScriptPage/AddScriptPage/AddScriptPage'
// import {DitailDevicePage} from './Page/DitailDevicePage'
// import {DevicesPage} from './Page/DevicesPage'
// import {ProfilePage} from './Page/ProfilePage'
// import {OptionsPage} from './Page/OptionsPage'
// import {ScriptsPage} from './Page/ScriptsPage'
// import {NewScriptsPage} from './Page/NewScriptsPage'
// import {UsersPage} from './Page/UsersPage'
// import {GalleryPage} from './Page/GalleryPage'
// import {AddDevicesPage} from './Page/AddDevicePage'
// import {AddMoviePage} from './Page/addFilesPages/NewMovie'
// import {AddActorPage} from './Page/addFilesPages/NewActors'
// import {AddGanrePage} from './Page/addFilesPages/NewGanre'
// import {ChartsPage} from './Page/ChartPage'
// import {MovieDitail} from './Page/filespage/movieDitail'
// import {MqttPage} from './Page/MqttTopics'
// import {ZigbeePage} from './Page/ZigbeePage'
// import {ModulsPage} from './Page/ModulsPage'
// import {GroupsPage} from './Page/GroupsPage'
// import {GroupsAddPage} from './Page/addGroupPage'
// import {EditStylePage} from './Page/EditStylePage'
// import AddUser from './Page/AddUser'

export const useRoutes = (isAuthenticated,role)=>{

  const {listenSocket, closeSocket} = useSocket()

  useEffect(()=>{
    if (isAuthenticated)
      listenSocket()
    return ()=>closeSocket()
  },[listenSocket, closeSocket])

  if(isAuthenticated){
    if(role === "none")
    {
      return(
        <Switch>
          <Route path="">
            <NonePage/>
          </Route>
          <Redirect to=""/>
        </Switch>
      )
    }
    return(
      <Switch>
        <Route path="/home" exact>
          <HomePage/>
        </Route>
        <Route path="/settings" exact>
          <SettingsPage/>
        </Route>
        <Route path="/profile" exact>
          <ProfilePage/>
        </Route>
        <Route path="/profile/edit" exact>
          <EditProfilePage/>
        </Route>
        <Route path="/profile/edit/password" exact>
          <EditPasswordPage/>
        </Route>
        <Route path="/users" exact>
          <UsersPage/>
        </Route>
        <Route path="/devices" exact>
          <DevicePage/>
        </Route>
        <Route path="/devices/edit/:systemName">
          <EditDevicePage/>
        </Route>
        <Route path="/scripts" exact>
          <ScriptPage/>
        </Route>
        <Route path="/scripts/add" exact>
          <AddScriptPage/>
        </Route>
        {
          (role === "admin")?
          <>
          <Route path="/users/add" exact>
            <AddUser/>
          </Route>
          <Route path="/devices/add" exact>
            <AddDevicePage/>
          </Route>
          </>:
          null
        }        
        <Redirect to="/home"/>
      </Switch>
    )
  }
  return(
    <Switch>
      <Route path="/">
        <AuthPage/>
      </Route>
      <Redirect to="/"/>
    </Switch>
  )
}
