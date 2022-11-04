import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {HomePage} from './Page/HomePage/HomePage'
import {AuthPage} from './Page/AuthPage/AuthPage'
import { SettingsPage } from './Page/Settings/SettingsPage'
import { ProfilePage } from './Page/ProfilePage/ProfilePage'
import { EditProfilePage } from './Page/ProfilePage/EditProfile'
import { EditPasswordPage } from './Page/ProfilePage/EditPassword'
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
        {/* <Route path="/devices" exact>
          <DevicesPage/>
        </Route>
        <Route path="/scripts" exact>
          <ScriptsPage/>
        </Route>
        <Route path="/scripts/add" exact>
          <NewScriptsPage/>
        </Route>
        <Route path="/scripts/edit/:id">
          <NewScriptsPage edit={true}/>
        </Route>
        <Route path="/profile">
          <ProfilePage/>
        </Route>
        <Route path="/groups" exact>
          <GroupsPage/>
        </Route>
        <Route path="/groups/add" exact>
          <GroupsAddPage/>
        </Route>
        <Route path="/groups/edit/:id" exact>
          <GroupsAddPage/>
        </Route>
        <Route path="/config/style" exact>
          <EditStylePage/>
        </Route>
        <Route path="/config/users" exact>
        {
          (role=='admin')?
          <OptionsPage/>:
          <Redirect to="/config"/>
        }
        </Route>
        <Route path="/config/server" exact>
        {
          (role=='admin')?
          <OptionsPage/>:
          <Redirect to="/config"/>
        }
        </Route>
        <Route path="/config">
          <OptionsPage/>
        </Route>
        <Route path="/users">
          <UsersPage/>
        </Route>
        <Route path="/devices/add" exact>
          <AddDevicesPage/>
        </Route>
        <Route path="/user/add" exact>
          <AddUser/>
        </Route>
        <Route path="/gallery">
          <GalleryPage/>
        </Route>
        <Route path="/chart">
          <ChartsPage/>
        </Route>

        <Route path="/moduls/:name">
          <ModulsPage/>
        </Route>

        <Route path="/movie/add" exact>
          <AddMoviePage/>
        </Route>
        <Route path="/serial/add" exact>
          <AddMoviePage type="serial"/>
        </Route>
        <Route path="/actor/add" exact>
          <AddActorPage/>
        </Route>
        <Route path="/ganre/add" exact>
          <AddGanrePage/>
        </Route>
        <Route path="/category/add" exact>
          <AddGanrePage type="category"/>
        </Route>


        <Route path="/devices/ditail/:systemName">
          <DitailDevicePage/>
        </Route>
        <Route path="/mqtt" exact>
          <MqttPage/>
        </Route>
        <Route path="/zigbee2mqtt" exact>
          <ZigbeePage/>
        </Route>

        <Route path="/movie/edit/:id">
          <AddMoviePage edit={true}/>
        </Route>
        <Route path="/serial/edit/:id">
          <AddMoviePage type="serial" edit={true}/>
        </Route>
        <Route path="/actor/edit/:id">
          <AddActorPage edit={true}/>
        </Route>
        <Route path="/ganre/edit/:id">
          <AddGanrePage edit={true}/>
        </Route>
        <Route path="/category/edit/:id">
          <AddGanrePage type="category" edit={true}/>
        </Route>

        <Route path="/movie/:id" exact>
          <MovieDitail/>
        </Route>
        <Route path="/serial/:id" exact>
          <MovieDitail type="serial"/>
        </Route> */}
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
