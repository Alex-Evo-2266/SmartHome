import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {HomePage} from './Page/HomePage/HomePage'
import {AuthPage} from './Page/AuthPage/AuthPage'
import { SettingsPage } from './Page/Settings/SettingsPage'
import { ProfilePage } from './Page/ProfilePage/ProfilePage'
import { EditProfilePage } from './Page/ProfilePage/EditProfile'
import { EditPasswordPage } from './Page/ProfilePage/EditPassword'
import { UsersPage } from './Page/UsersPage/UsersPage'
import { NonePage } from './Page/NonePage/NonePage'
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
