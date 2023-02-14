import React,{useEffect, useRef, useState} from 'react'
import { Condition } from './EditBlock/Condition'

export const EditConditionBlock = ({data, update, hide})=>{

    const [condition, setCondition] = useState({
        arg1:"",
        arg2:"",
        operatoe:"",
        value:{}
    })

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
                    <Condition data={condition} update={updateCondition}/>
                </div>
            </div>
            <div className="card-btn-container">
                <button className="btn" onClick={saveCondition}>save</button>
                <button className="btn" onClick={hide}>cencel</button>
            </div>
        </>
    )
}
