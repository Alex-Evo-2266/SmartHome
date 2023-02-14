import React,{useEffect, useRef, useState} from 'react'
import { Condition } from './EditBlock/Condition'

const conditionDef = {
    arg1:"",
    arg2:"",
    operatoe:"",
    value:{}
}

export const EditIfBlock = (data, update)=>{

    const [condition, setCondition] = useState([])

    const addCondition = ()=>{
        let newCondition = condition.slice()
        newCondition.push(conditionDef)
        setCondition(newCondition)
    }

    const updataCondition = (newData)=>{
        console.log(data)
    }

    const deleteElement = (index)=>{
        setCondition(prev => prev.filter((item, index2) => index2 !== index))
    }

    return(
        <div>
            {
                condition.map((item, index)=>(
                    <div key={index} className='edit-block tab-list scrollbar-base'>
                        <Condition data={item} update={updataCondition} del={()=>deleteElement(index)}/>
                    </div>
                ))
            }
            <button className='btn' onClick={addCondition}>add</button>
        </div>
        
    )
}