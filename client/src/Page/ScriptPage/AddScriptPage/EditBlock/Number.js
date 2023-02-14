import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorAlert, showWarningAlert } from '../../../../store/reducers/alertReducer'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { Value } from './Value'

export const NumberComponent = ({data, update})=>{

    const updateValue = useCallback((e)=>{
        update(prev=>({...prev, arg1:String(e.target.value)}))
    },[update])

    return(
        <>
            <div className='tab-list-item input-data'>
                <input type="number" value={Number(data.arg1)} onChange={updateValue}/>
            </div>
        </>
    )
}