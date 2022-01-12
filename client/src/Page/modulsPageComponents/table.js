import React,{useState, useEffect, useCallback, useContext} from 'react'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {Menu} from '../../components/Menu/dopmenu/menu'
import {useDecodePath} from './pathDecodhook'
import {useMenuModuls} from './menuModuls'

export const Table = ({data=[], conf}) => {
  const auth = useContext(AuthContext)
  const {getmenu} = useMenuModuls()
  const {getfields} = useDecodePath()
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const clickmenu = (item, datael)=>{
    console.log(item,datael);

  }

  const getMenubtns = (menu,datael)=>{
    let arr = []
    for (let item of menu) {
      arr.push({
        title:getfields(item.title,datael),
        onClick:()=>clickmenu(item,datael)
      })
      return arr
    }
  }

  return (
    <div className="mqttTableDiv">
      <table className="mqttTable">
        <thead>
          <tr>
          {
            conf?.fields.map((item, index)=>{
              return(
                <th key={index}>
                  {item.title}
                </th>
              )
            })
          }
          {
            (conf.menu)?
            <th className="menu">
            </th>
            :null
          }
          </tr>
        </thead>
        <tbody>
        {
          data?.map((item, index)=>{
            return(
              <tr key={index}>
                {
                  conf.fields.map((item2, index2)=>{
                    return(
                      <td key={index2}>
                        {getfields(item2.value, item)}
                      </td>
                    )
                  })
                }
                {
                  (conf.menu)?
                  <td className="menu">
                  <Menu className="table" buttons={getmenu(conf, item, ()=>{})}/>
                  </td>
                  :null
                }
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}
