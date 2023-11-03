import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { useCallback, useEffect, useState } from "react"
import {icons} from '../../../entites/Icon/index'
import './iconSelect.scss'
import { showFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { SelectIconDialog } from "./ChoiseIconDialog"
import { IItem } from "../models/item"

interface ISelectIconFieldProps{
    onChange?:(value: string)=>void
    value?: string
    className?: string
    border?: boolean
    error?: boolean
    onFocus?: (e:React.FocusEvent<HTMLInputElement>)=>void
    onBlur?: (e:React.FocusEvent<HTMLInputElement>)=>void
}


export const SelectIconField = ({onChange, value, className, border, error, onBlur, onFocus}:ISelectIconFieldProps) => {

    const [icon, setIcon] = useState<IItem | null>(null)
    const dispatch = useAppDispatch()

    const getItems = useCallback(()=>{
        let arr:IItem[] = []
        for(let key in icons){
            arr.push({key, icon: icons[key]})
        }
        return arr
    },[icons])

    const show = useCallback(()=>{
        dispatch(showFullScreenDialog(<SelectIconDialog initValue={icon ?? undefined} items={getItems()} onChange={(data)=>{
            if(data)
            {
                setIcon({key:data, icon:icons[data]})
                onChange && onChange(data)
            }
        }}/>))
    },[getItems, icons])

    useEffect(()=>{
        if(value && icons[value])
        {
            setIcon({key: value, icon: icons[value]})
        }
    },[value, icons])

    return(
        <>
            <div className={`select-field ${className} ${border?"border":""}`}>
                <div className="input-container icon-input-container" onClick={show}>
                    {
                        (icon)?
                        <icon.icon/>
                        :null
                    }
                    <span className="text-field-line"></span>
                </div>
            </div>
        </>
    )
}