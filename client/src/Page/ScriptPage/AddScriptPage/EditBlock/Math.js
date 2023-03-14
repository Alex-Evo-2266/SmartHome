import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorAlert, showWarningAlert } from '../../../../store/reducers/alertReducer'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { Value } from './Value'

export const Math = ({data, update})=>{

    const updateValue1 = useCallback((dataV)=>{
        update(prev=>({...prev, arg1:dataV}))
    },[update])

    const updateValue2 = useCallback((dataV)=>{
        update(prev=>({...prev, arg2:dataV}))
    },[update])

    const selectionOperator = useCallback((e)=>{
        update(prev=>({...prev, operator:e.target.value}))
    },[update])

    return(
        <>
            <div className='tab-list-item'>
                <Value type="number" data={data.arg1} update={updateValue1}/>
            </div>
                <div className='tab-list-item'>
                    <div className='tab-list-item-content'>
                        <select className='btn padding' onChange={selectionOperator} value={data.operator}>
                            <option value={"+"}>{"+"}</option>
                            <option value={"-"}>{"-"}</option>
                            <option value={"*"}>{"*"}</option>
                            <option value={"/"}>{"/"}</option>
                        </select>
                    </div>
                </div>
            <div className='tab-list-item'>
                <Value type="number" data={data.arg2} update={updateValue2}/>
            </div>
        </>
    )
}