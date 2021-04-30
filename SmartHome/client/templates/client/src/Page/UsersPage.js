import React,{useState,useEffect,useCallback,useContext} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {Loader} from '../components/Loader'
import {UserElement} from '../components/usersCart/userElement'

export const UsersPage = () => {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading,request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const searchHandler = event => {
    setSearch(event.target.value)
  }

  const updataUsers = useCallback(async()=>{
    const data = await request('/api/users/get', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setUsers(data);
    console.log(data);
    setAllUsers(data)
  },[request,auth.token])

  const searchout = ()=>{
    if(search===""){
      setUsers(allUsers)
      return
    }
    let array = allUsers.filter(item => (item.UserName.toLowerCase().indexOf(search.toLowerCase())!==-1)||(item.UserSurname.toLowerCase().indexOf(search.toLowerCase())!==-1))
    setUsers(array)
  }

  const keyd = (e)=>{
    if(e.keyCode===13){
      searchout()
    }
  }

  useEffect(()=>{
    updataUsers()
  },[updataUsers])

  if(loading){
    return(
      <Loader/>
    )
  }

  return(
    <>
      <div className = "conteiner top">
        <header>
          <h1>All Users</h1>
          {
            (auth.userLevel===3)?
            <Link to = "/config/users" className="titleButtonAdd"><i className="fas fa-cog"></i></Link>:
            null
          }
          <input type="search" name="search" id="searchDevices" onChange={searchHandler} onKeyDown={keyd} value={search}/>
          <button onClick={searchout} className="searchBtn">Search</button>
        </header>
        <div className = "Users">
          <div className="usersList">
            {
              (users&&users[0])?
                users.map((item,index)=>{
                  return(
                    <UserElement key={index} user={item} updata={updataUsers}/>
                  )
                })
              :null
            }
          </div>
        </div>
      </div>
    </>
  )
}
