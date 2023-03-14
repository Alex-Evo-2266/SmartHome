import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorAlert, showWarningAlert } from '../../../../store/reducers/alertReducer'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { Value } from './Value'

export const Select = ({data, update, values=[]})=>{

    useEffect(()=>{
        if (data.arg1 === "")
            update(prev=>({...prev, arg1:values[0]}))
    },[data])

    const updateValue1 = useCallback((e)=>{
        update(prev=>({...prev, arg1:e.target.value}))
    },[update])

    return(
        <>
            <div className='tab-list-item'>
                <div className='tab-list-item-content'>
                    <select className='btn padding' onChange={updateValue1} value={data.arg1}>
                    {
                        values.map((item, index)=>(
                            <option key={index} value={item}>{item}</option>
                        ))
                    }
                    </select>
                </div>
            </div>
        </>
    )
}