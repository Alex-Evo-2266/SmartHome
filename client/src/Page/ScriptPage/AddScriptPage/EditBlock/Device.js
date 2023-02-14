import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'

const formatDevice = (devices) => devices.map(item=>({title:item.name, data:item}))
const formatField = (fields) => fields.map(item=>({title:item.name, data:item}))

export const DeviceValue = ({data, update})=>{

    const dispatch = useDispatch()
    const {devices} = useSelector(state=>state.socket)

    const selectionDevice = useCallback(()=>{
        dispatch(showConfirmationDialog("Selection device", formatDevice(devices), data1=>{
            dispatch(showConfirmationDialog("Selection device", formatField(data1.fields), data2=>{
                update(prev=>({...prev,arg1:data1.system_name, arg2:data2.name}))
                dispatch(hideDialog())
            }))
        }))
    },[update])

    return(
        <>
            <div className='tab-list-item'>{
                (data.arg1==="")?
                <div className='tab-list-item-content'><button className='btn padding' onClick={selectionDevice}>select device</button></div>:
                <>
                <div className='tab-list-item-content'>
                    <p>{data.arg1}.{data.arg2}</p>
                </div>
                </>
            }</div>
        </>
    )
}