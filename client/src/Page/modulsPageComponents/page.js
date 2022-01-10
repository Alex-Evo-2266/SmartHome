import React,{useState, useEffect, useCallback, useContext} from 'react'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {SocketContext} from '../../context/SocketContext'
import {useDecodePath} from './pathDecodhook'
import {Card} from './Card'
import {Table} from './table'

export const Page = ({data={}, updateMenu}) => {
  const auth = useContext(AuthContext)
  const socket = useContext(SocketContext)
  const {getfields, gettext} = useDecodePath()
  const [dataPage, setDataPage] = useState([])
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const getData = useCallback(async()=>{
    console.log(data);
    if(!(data?.content?.src)) return ;
    const data1 = await request(data?.content?.src, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data1);
    setDataPage(data1)
    return data1
  },[request,auth.token,data])

  const action = useCallback(async(dataf)=>{
    console.log("test", dataf);
    for (var item of dataf) {
      if(item.type === "update")
        getData()
      else {
        console.log(item);
        await request(item.address, item.method, item.body,{Authorization: `Bearer ${auth.token}`})
      }
    }
  },[getData,request,auth.token])

  useEffect(()=>{
    if(!(data?.content?.ws_src)) return ;
    if(socket.message.type===data?.content?.ws_src) {
      setDataPage(socket.message.data)
    }
  },[socket.message,data?.content?.ws_src])

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  useEffect(()=>{
    getData()
  },[getData])

  useEffect(()=>{
    console.log(data);
    if (!(data?.menu)) return ;
    let arr = []
    for (let item of data?.menu) {
      arr.push({
        title:getfields(item.title,dataPage),
        onClick:()=>action(item.action)
      })
    }
    updateMenu(arr)
  },[dataPage,data,action,getfields,updateMenu])

  return (
    <div className={`conteiner`}>
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
