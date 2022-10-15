import React,{useState,useEffect,useCallback,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {MenuContext} from '../components/Menu/menuContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {Loader} from '../components/Loader'
import {UserElement} from '../components/usersCart/userElement'

export const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const {setData} = useContext(MenuContext)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const history = useHistory()
  const {loading,request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const updataUsers = useCallback(async()=>{
    const data = await request('/api/user/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setUsers(data);
    setAllUsers(data)
  },[request,auth.token])

  const searchout = useCallback((search)=>{
    if(search===""){
      setUsers(allUsers)
      return
    }
    let array = allUsers.filter(item => (item.UserName.toLowerCase().indexOf(search.toLowerCase())!==-1)||(item.UserSurname.toLowerCase().indexOf(search.toLowerCase())!==-1))
    setUsers(array)
  },[allUsers])

  useEffect(()=>{
    setData("Users",{
      specialAction:(auth.userLevel >= 3)?{
        type: "add",
        action:()=>history.push("/user/add")
      }:null,
      search: searchout
    })
  },[setData, history, searchout, auth.userLevel])

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
