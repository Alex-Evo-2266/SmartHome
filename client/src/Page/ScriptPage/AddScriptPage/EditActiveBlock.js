import React,{useEffect, useRef, useState} from 'react'
import { Active } from './EditBlock/Active'

export const EditActiveBlock = ({data, update, hide})=>{

    const [condition, setCondition] = useState({
        arg1:"",
        arg2:"",
        operatoe:"",
        value:{}
    })

    useEffect(()=>{
        console.log(condition)
    },[condition])

    const updateCondition = (newData)=>{
        setCondition(newData)
    }

    const saveCondition = () => {
        if (typeof(update) === "function")
            update(condition)
    }

    return(
        <>
            <div>
                <div className='edit-block tab-list scrollbar-base'>
                    <Active data={condition} update={updateCondition}/>
                </div>
            </div>
            <div className="card-btn-container">
                <button className="btn" onClick={saveCondition}>save</button>
                <button className="btn" onClick={hide}>cencel</button>
            </div>
        </>
    )
}
