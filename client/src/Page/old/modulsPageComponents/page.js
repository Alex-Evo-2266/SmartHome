import React,{useState, useEffect, useCallback, useContext} from 'react'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {SocketContext} from '../../context/SocketContext'
import {useDecodePath} from './pathDecodhook'
import {useMenuModuls} from './menuModuls'
import {Card} from './Card'
import {Table} from './table'

export const Page = ({data={}, updateMenu}) => {
  const auth = useContext(AuthContext)
  const socket = useContext(SocketContext)
  const {getfields, gettext} = useDecodePath()
  const {getmenu} = useMenuModuls()
  const [dataPage, setDataPage] = useState([])
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const getData = useCallback(async()=>{
    if(!(data?.src)) return ;
    const data1 = await request(data?.src, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setDataPage(data1)
    return data1
  },[request,auth.token,data])

  useEffect(()=>{
    if(!(data?.ws_src)) return ;
    if(socket.message.type===data?.ws_src) {
      setDataPage(socket.message.data)
    }
  },[socket.message,data?.ws_src])

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  useEffect(()=>{
    getData()
  },[getData])

  useEffect(()=>{
    if (!(data?.menu)) return ;
    updateMenu(getmenu(data, dataPage, getData))
  },[dataPage,data,getfields,updateMenu,getData,getmenu])

  return (
    <div className={`conteiner ${(data?.content?.typeContent === "table")?"color-normal":""}`}>
      {
        (data?.content?.typeContent === "cards")?
        <div className="Devices">
        <div className="CardConteiner">
        {
          gettext(dataPage, data.content.rootField)?.map((item, index)=>{
            return(
              <Card key={index} data={item} conf={data.content.items}/>
            )
          })
        }
        </div>
        </div>:
        (data?.content?.typeContent === "table")?
        <Table data={gettext(dataPage, data.content.rootField)} conf={data.content.items}/>
        :null
      }
    </div>
  )
}
