import React from 'react'
import {useDecodePath} from './pathDecodhook'

export const Table = ({data={}, conf}) => {
  const {getfields} = useDecodePath()

  return (
    <div className="mqttTableDiv">
      <table className="mqttTable">
        <thead>
          <tr>
          {
            conf.fields.map((item, index)=>{
              return(
                <th key={index}>
                  {item.title}
                </th>
              )
            })
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
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}
