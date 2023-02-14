import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showWarningAlert } from '../../../../store/reducers/alertReducer'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { Value } from './Value'

const formatDevice = (devices) => devices.map(item=>({title:item.name, data:item}))
const formatField = (fields) => fields.map(item=>({title:item.name, data:item}))
const formatObjects = (objects) => objects.map(item=>({title:item, data:item}))

const typesObject = ["device", "system", "datetime", "weather"]

export const Condition = ({data, update, del, options={}})=>{

    const read = useRef(0)
    const dispatch = useDispatch()
    const {devices} = useSelector(state=>state.socket)
    const [dataCondition, setDataCondition] = useState({
        type_object:"",
        arg1:"",
        arg2:"",
        operator:"==",
        value:null
    })

    useEffect(()=>{
        console.log(dataCondition)
    },[dataCondition])

    useEffect(()=>{
        if (read.current > 0) return
        console.log("p0")
        setDataCondition({
            type_object:data?.type_object||"",
            arg1:data?.arg1||"",
            arg2:data?.arg2||"",
            operator:data?.operator||"==",
            value:data?.value||null
        })
        read.current = read.current + 1
    },[read.current])

    const selectionCondition = ()=>{
        dispatch(showConfirmationDialog("Selection device", formatObjects(typesObject), data0=>{
            setDataCondition(prev=>({...prev, type_object:data0}))
            if(data0 === "device")
                selectionDevice()
            else
                console.log(data0)
        }))
    }

    const selectionDevice = ()=>{
        dispatch(showConfirmationDialog("Selection device", formatDevice(devices), data1=>{
            setDataCondition(prev=>({...prev, arg1:data1.system_name}))
            dispatch(showConfirmationDialog("Selection device", formatField(data1.fields), data2=>{
                setDataCondition(prev=>({...prev, arg2:data2.name, operator:"=="}))
                dispatch(hideDialog())
            }))
        }))
    }

    const selectionOperator = (e)=>{
        setDataCondition(prev=>({...prev, operator:e.target.value}))
    }

    const updateValue = useCallback((data)=>{
        setDataCondition(prev=>({...prev, value:data}))
    },[])

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
                        <select className='btn padding' onChange={selectionOperator} value={dataCondition.operator}>
                            <option value={"=="}>{"=="}</option>
                            <option value={"!="}>{"!="}</option>
                            <option value={">"}>{">"}</option>
                            <option value={"<"}>{"<"}</option>
                        </select>
                    </div>
                </div>
                :null
            }
            {
                (dataCondition.arg1!=="" && dataCondition.arg2!=="" && dataCondition.type_object!=="")?
                <Value deviceName={dataCondition.arg1} deviceField={dataCondition.arg2} data={dataCondition.value} update={updateValue}/>:null
            }
            <div className='tab-list-item-del' onClick={del}>x</div>
        </div>
    )
}