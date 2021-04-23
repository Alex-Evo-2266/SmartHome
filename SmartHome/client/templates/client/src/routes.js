import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {HomePage} from './Page/HomePage'
import {AuthPage} from './Page/AuthPage'
// import RegisterPage from './Page/RegisterPage'
import {DevicesPage} from './Page/DevicesPage'
import {ProfilePage} from './Page/ProfilePage'
import {OptionsPage} from './Page/OptionsPage'
import {ScriptsPage} from './Page/ScriptsPage'
import {NewScriptsPage} from './Page/NewScriptsPage'
import {UsersPage} from './Page/UsersPage'
import {FilesPage} from './Page/FilesPage'
import {AddDevicesPage} from './Page/AddDevicePage'
import {AddMoviePage} from './Page/addFilesPages/NewMovie'
import {AddActorPage} from './Page/addFilesPages/NewActors'
import {AddGanrePage} from './Page/addFilesPages/NewGanre'
import {MovieDitail} from './Page/filespage/movieDitail'
import AddUser from './Page/AddUser'

export const useRoutes = (isAuthenticated,level)=>{
  if(isAuthenticated){
    return(
      <Switch>
        <Route path="/home" exact>
          <HomePage/>
        </Route>
        <Route path="/devices" exact>
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
        <Route path="/config/users" exact>
        {
          (level===3)?
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



        <Route path="/files">
          <FilesPage/>
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
        </Route>
        <Redirect to="/home"/>
      </Switch>
    )
  }
  return(
    <Switch>
      <Route path="/" exact>
        <AuthPage/>
      </Route>
      <Redirect to="/"/>
    </Switch>
  )
}
