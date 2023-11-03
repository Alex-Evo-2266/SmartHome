import { useCallback, useEffect, useState } from "react"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { FullScrinTemplateDialog } from "../../../shared/ui"
import { IItem } from "../models/item"

export interface ISelectIconDialogProps{
    items: IItem[]
    onChange?: (data: string | null)=>void
    initValue?: IItem
}

export const SelectIconDialog = ({items, onChange, initValue}:ISelectIconDialogProps) => {

	const dispatch = useAppDispatch()
    const [icon, setIcon] = useState<string | null>(initValue?.key ?? null)

    const hide = useCallback(() => {
		dispatch(hideFullScreenDialog())
	},[dispatch])

    const save = useCallback(() => {
        onChange && onChange(icon)
        hide()
	},[hide, icon])

    return (
        <FullScrinTemplateDialog onHide={hide} header={`Select Icon`} onSave={save}>
            <div className="icons-dialog">
            {
            items.map((item, index)=>(
                <div key={index} className={`icons-dialog-item ${(icon === item.key)?"active":""}`} onClick={()=>setIcon(item.key)}>
                    <item.icon size={24}/>
                </div>
            ))
        }
            </div>
        </FullScrinTemplateDialog>
    )
}