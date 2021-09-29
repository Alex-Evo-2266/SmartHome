import React,{useState,useEffect,useCallback,useContext} from 'react'
import {Header} from '../components/header'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {Loader} from '../components/Loader'
import {UserElement} from '../components/usersCart/userElement'

export const UsersPage = () => {
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

  const updataUsers = useCallback(async()=>{
    const data = await request('/api/users', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setUsers(data);
    console.log(data);
    setAllUsers(data)
  },[request,auth.token])

  const searchout = (search)=>{
    if(search===""){
      setUsers(allUsers)
      return
    }
    let array = allUsers.filter(item => (item.UserName.toLowerCase().indexOf(search.toLowerCase())!==-1)||(item.UserSurname.toLowerCase().indexOf(search.toLowerCase())!==-1))
    setUsers(array)
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
      <Header search={searchout} name="All Users">
      {
        (auth.userLevel===3)?
        <Link to={"/user/add"} className="btn"><i className="fas fa-plus"></i></Link>:
        null
      }
      </Header>
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
