import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showWarningAlert } from '../../../../store/reducers/alertReducer'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { formatDevice, formatField, formatObjects } from '../utils'
import { Value } from './Value'

const typesObject = ["device", "system", "datetime", "weather"]

const defCondition = {
    type_object:"",
    arg1:"",
    arg2:"",
    operator:"=",
    value:null
}

// const defState = (data) => {
//     if (data?.arg1) return data
//     return defCondition
// }

export const Active = ({data, update})=>{

    const read = useRef(0)
    const dispatch = useDispatch()
    const {devices} = useSelector(state=>state.socket)
    const [dataCondition, setDataCondition] = useState(defCondition)

    useEffect(()=>{
        if (read.current > 0) return
        setDataCondition({
            type_object:data?.type_object||"",
            arg1:data?.arg1||"",
            arg2:data?.arg2||"",
            operator:data?.operator||"=",
            value:data?.value||null
        })
        read.current = read.current + 1
    },[read.current])

    const setDataConditionAndUpdate = useCallback((newData)=>{
        if (typeof(newData) === "function")
        {
            let data2 = newData(dataCondition)
            setDataCondition(newData)
            update(data2)
        }
        else
        {
            setDataCondition(newData)
            update(newData)
        }
    },[update, dataCondition])

    const selectionCondition = useCallback(()=>{
        dispatch(showConfirmationDialog("Selection opject", formatObjects(typesObject), data0=>{
            setDataConditionAndUpdate(prev=>({...prev, type_object:data0}))
            if(data0 === "device")
                selectionDevice()
            else
                console.log(data0)
        }))
    },[setDataConditionAndUpdate])

    const selectionDevice = useCallback(()=>{
        dispatch(showConfirmationDialog("Selection device", formatDevice(devices), data1=>{
            dispatch(showConfirmationDialog("Selection field", formatField(data1.fields), data2=>{
                setDataConditionAndUpdate(prev=>({...prev, arg2:data2.name, arg1:data1.system_name, operator:"="}))
                dispatch(hideDialog())
            }))
        }))
    },[setDataConditionAndUpdate])

    const updateValue = useCallback((data)=>{
        setDataConditionAndUpdate(prev=>({...prev, value:data}))
    },[setDataConditionAndUpdate])

    const deleteCondition = useCallback(()=>{
        setDataConditionAndUpdate(defCondition)
    },[setDataConditionAndUpdate])

    return(
        <div className='block-device scroll'>
            <div className='tab-list-item'>{
                (dataCondition.arg1==="" || dataCondition.type_object==="")?
                <div className='tab-list-item-content'><button className='btn padding' onClick={selectionCondition}>objects</button></div>:
                <>
                <div className='tab-list-item-content'>
                    <p>{dataCondition.arg1}.{dataCondition.arg2}</p>
                </div>
                </>
            }</div>
            {
                (dataCondition.arg1!=="" && dataCondition.type_object!=="")?
                <div className='tab-list-item'>
                    <div className='tab-list-item-content'>
                        <p className='text padding'>=</p>
                    </div>
                </div>
                :null
            }
            {
                (dataCondition.arg1!=="" && dataCondition.arg2!=="" && dataCondition.type_object!=="")?
                <Value deviceName={dataCondition.arg1} deviceField={dataCondition.arg2} data={dataCondition.value} update={updateValue}/>:null
            }
            <div className='tab-list-item-del' onClick={deleteCondition}>x</div>
        </div>
    )
}