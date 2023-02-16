import React,{useEffect, useRef, useState} from 'react'
import { Condition } from './EditBlock/Condition'

export const EditConditionBlock = ({data, update, hide, deleteEl})=>{

    const read = useRef(0)
    const [condition, setCondition] = useState({
        type_object: "",
        arg1: "",
        arg2: "",
        operatoe: "",
        value: {}
    })

    useEffect(()=>{
        console.log(data)
        if (read.current > 0) return;
        setCondition({
            type_object: data?.type_object ?? "",
            arg1: data?.arg1 ?? "",
            arg2: data?.arg2 ?? "",
            operatoe: data?.operatoe ?? "",
            value: data?.value ?? {},
        })
        read.current = read.current + 1
    },[])

    const updateCondition = (newData)=>{
        setCondition(newData)
    }

    const saveCondition = () => {
        if (typeof(update) === "function")
            update(condition)
    }

    const deleteCondition = ()=>{
        if (typeof(deleteEl) === "function")
            deleteEl()
    }

    return(
        <>
            <div>
                <div className='edit-block tab-list scrollbar-base'>
                    <Condition data={condition} update={updateCondition}/>
                </div>
            </div>
            <div className="card-btn-container">
                <button className="btn red" onClick={deleteCondition}>delete</button>
                <button className="btn" onClick={saveCondition}>save</button>
                <button className="btn" onClick={hide}>cencel</button>
            </div>
        </>
    )
}
