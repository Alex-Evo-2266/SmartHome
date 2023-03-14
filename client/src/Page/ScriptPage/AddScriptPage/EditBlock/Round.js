import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorAlert, showWarningAlert } from '../../../../store/reducers/alertReducer'
import { hideDialog, showAlertDialog, showConfirmationDialog } from '../../../../store/reducers/dialogReducer'
import { Value } from './Value'

export const Round = ({data, update})=>{

    const updateValue1 = useCallback((dataV)=>{
        update(prev=>({...prev, arg1:dataV}))
    },[update])

    const updateValue2 = useCallback((e)=>{
        update(prev=>({...prev, arg2:String(e.target.value)}))
    },[update])

    return(
        <>
            <div className='tab-list-item'>
                <Value type="number" data={data?.arg1} update={updateValue1}/>
            </div>
            <p style={{textAlign: "center"}}>Round</p>
            <div className='tab-list-item input-data'>
                <input type="number" value={Number(data?.arg2)} onChange={updateValue2}/>
            </div>
        </>
    )
}