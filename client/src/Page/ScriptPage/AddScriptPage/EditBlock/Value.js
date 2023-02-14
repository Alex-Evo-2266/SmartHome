import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorAlert, showWarningAlert } from '../../../../store/reducers/alertReducer'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { DeviceValue } from './Device'
import { Math } from './Math'
import { Number } from './Number'
import { Round } from './Round'
import { Select } from './Select'

const formatObjects = (objects) => objects.map(item=>({title:item, data:item}))

const searchField = (devices, systemName, fieldName) => {
    let devCondidat = devices.filter(item=>item.system_name === systemName)
    if (devCondidat.length == 0) return null
    let fieldCondidat = devCondidat[0].fields.filter(item=>item.name === fieldName)
    if (fieldCondidat.length == 0) return null
    return fieldCondidat[0]
}

const getValues = (devices, systemName, fieldName) => {
    let field = searchField(devices, systemName, fieldName)
    if (!field) return null
    if (field.type === "binary")
        return ["off", "on"]
    if (field.type === "enum")
    {
        console.log(field)
        let arr = field.enum_values.split(",")
        console.log(arr)
        for (let item of arr)
        {
            item.trim()
        }
        console.log(arr)
        return (arr)
    }
    return []
}

const getTypeValue = (typeField) => {
    switch (typeField) {
        case "binary":
            return ["select", "device"]
        case "number":
            return ["number", "math", "round", "device"]
        case "text":
            return ["text"]
        case "enum":
            return ["select"]
        default:
            return ["text"]
    }
}

const defValueData = {
    type:"",
    arg1:"",
    arg2:"",
    operator:"=="
}


export const Value = ({data, deviceName=null, deviceField=null, type=null, update, options={}})=>{
    // dispatch initialize
    const dispatch = useDispatch()

    // validete argument
    if ((!deviceName || !deviceField) && !type)
    {
        dispatch(showErrorAlert("invalid value argument", "invalid value argument"))
        throw new Error("invalid value argument")
        return (null)
    }


    const [dataValue, setDataValue] = useState(data)
    const read = useRef(0)
    const {devices} = useSelector(state=>state.socket)

    const setDataValueAndUpdate = useCallback((newData)=>{
        if (typeof(newData) === "function")
        {
            console.log(dataValue)
            let data2 = newData(dataValue)
            setDataValue(newData)
            update(data2)
        }
        else
        {
            setDataValue(newData)
            update(newData)
        }
    },[update, dataValue])

    useEffect(()=>{
        console.log(dataValue)
    },[dataValue])

    useEffect(()=>{
        if (read.current > 0) return
        setDataValue({
            type:data?.type||"",
            arg1:data?.arg1||"",
            arg2:data?.arg2||"",
            operator:data?.operator||""
        })
        read.current = read.current + 1
    },[read.current])

    const selectValue2 = useCallback((typeVal)=>{
        if (typeVal === "math")
            return setDataValueAndUpdate({
                type:"math",
                arg1:null,
                arg2:null,
                operator: "+"
            })
        if (typeVal === "round")
            return setDataValueAndUpdate({
                type: "round",
                arg1: null,
                arg2: "0",
                operator: ""
            })
        if (typeVal === "number")
            return setDataValueAndUpdate({
                type: "number",
                arg1: "0",
                arg2: null,
                operator: ""
            })
        if (typeVal === "select")
            return setDataValueAndUpdate({
                type: "select",
                arg1: "",
                arg2: null,
                operator: ""
            })
        if (typeVal === "device")
            return setDataValueAndUpdate({
                type: "device",
                arg1: "",
                arg2: "",
                operator: ""
            })
    },[setDataValueAndUpdate])

    const selectValue = useCallback(()=>{
        let typsArray
        if (type)
            typsArray = getTypeValue(type)
        else
        {
            let field = searchField(devices, deviceName, deviceField)
            if (!field)
                return dispatch(showWarningAlert("field", "not foun device or field"))
            typsArray = getTypeValue(field.type)
        }
        console.log(typsArray)
        if (typsArray.length === 1)
            selectValue2(typsArray[0])
        else if (typsArray.length > 1)
            dispatch(showConfirmationDialog("select value", formatObjects(typsArray), data=>{
                selectValue2(data)
                dispatch(hideDialog())
            }))
        else
            return dispatch(showWarningAlert("field", "not foun device or field"))
    },[selectValue2, dispatch])

    const deleteValue = useCallback(()=>{
        update(defValueData)
        setDataValue(defValueData)
    },[update])

    return(
        <div className='block-device'>
            <div className='tab-list-item'>{
                (dataValue.type==="")?
                <div className='tab-list-item-content'><button className='btn padding' onClick={selectValue}>value</button></div>:
                <>
                <div className='tab-list-item-content'>
                {
                    (dataValue.type === "number")?
                    <Number data={dataValue} update={setDataValueAndUpdate}/>:
                    (dataValue.type === "math")?
                    <Math data={dataValue} update={setDataValueAndUpdate}/>:
                    (dataValue.type === "round")?
                    <Round data={dataValue} update={setDataValueAndUpdate}/>:
                    (dataValue.type === "select")?
                    <Select data={dataValue} update={setDataValueAndUpdate} values={getValues(devices, deviceName, deviceField)}/>:
                    (dataValue.type === "device")?
                    <DeviceValue data={dataValue} update={setDataValueAndUpdate}/>:
                    null
                }
                </div>
                <div className='tab-list-item-del' onClick={deleteValue}>x</div>
                </>
            }</div>
        </div>
    )
}