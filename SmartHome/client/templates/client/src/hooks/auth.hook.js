import {useState, useCallback, useEffect} from 'react';

const storegeName = 'UserData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const [ready, setReady] = useState(false)


  const login = useCallback((jwtToken, id,level)=>{
    setToken(jwtToken);
    setUserId(id);
    setUserLevel(level);

    localStorage.setItem(storegeName, JSON.stringify({
      userId: id, userLevel:level, token:jwtToken
    }))
  },[])

  const logout = useCallback(()=>{
    setToken(null);
    setUserId(null);
    setUserLevel(null);
    localStorage.removeItem(storegeName)
  },[])

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem(storegeName))

    if(data&&data.token){
      login(data.token, data.userId, data.userLevel)
    }
    setReady(true);
  },[login])

  return {login, logout, token, userId, userLevel,ready}
}
