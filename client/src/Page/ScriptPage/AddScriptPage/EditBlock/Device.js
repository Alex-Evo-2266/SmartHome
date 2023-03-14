import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { filterDeviceByTypeField, filterFieldByType, formatDevice, formatField } from '../utils'

export const DeviceValue = ({data, update, type})=>{

    const dispatch = useDispatch()
    const {devices} = useSelector(state=>state.socket)

    const selectionDevice = useCallback(()=>{
        dispatch(showConfirmationDialog("Selection device", formatDevice(filterDeviceByTypeField(devices, type)), data1=>{
            dispatch(showConfirmationDialog("Selection field", formatField(filterFieldByType(data1.fields, type)), data2=>{
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