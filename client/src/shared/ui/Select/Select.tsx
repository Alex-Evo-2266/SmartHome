import { useAppDispatch } from "../../lib/hooks/redux"
import { DialogType, hideDialog, showDialog } from "../../lib/reducers/baseDialogReducer"
import { SelectionDialog } from "../Dialog/BaseDialog/SelectionDialog"
import "./Select.scss"
import { useCallback, useState } from "react"

export interface IOption{
    title: string
    value: string
    // icon?: React.ReactNode
}

interface ISelectFieldProps{
    onChange?:(value: string)=>void
    value?: string
    placeholder?: string
    className?: string
    items: (IOption | string)[]
    border?: boolean
    name?: string
    error?: boolean
}

const getValue = (item:IOption | string) => (typeof(item) === "string")?item:item.value
const getTitle = (item:IOption | string) => (typeof(item) === "string")?item:item.title

const getTitleByValue = (items:(IOption | string)[], value: string) => {
    for(let item of items)
    {
        if(typeof(item) === "string" && item === value)
            return item
        if(typeof(item) !== "string" && item.value === value)
            return item.title
    }
    return ""
}

const selectMap = (item: IOption | string) => {
    if(typeof(item) === "string")
        return {title: item, data: item}
    return {title: item.title, data: item.value}
}
        

export const SelectField = ({items, onChange, value, placeholder, className, border, name, error}:ISelectFieldProps) => {

    const [selectTitle, setSelectTitle] = useState<string>(getTitleByValue(items, value ?? ""))
    const dispatch = useAppDispatch()

    const change = useCallback((data: string) => {
        setSelectTitle(getTitleByValue(items, data))
        onChange && onChange(data)
    },[items])

    const show = useCallback(() => {
        dispatch(showDialog({
            type: DialogType.BASE_DIALOG,
            dialog: <SelectionDialog 
                        items={items.map(selectMap)} 
                        header={placeholder ?? ""} 
                        onHide={()=>dispatch(hideDialog(DialogType.BASE_DIALOG))}
                        onSuccess={change}
                        />
        }))
    },[dispatch, showDialog, hideDialog, change])
   
    // return(
    //     <div className={`dropdown ${className} ${(visible)?"active":""} ${border?"border":""}`}>
    //         <div className="backplate" onClick={()=>setVisible(false)}></div>
    //         <div className={`select-field ${border?"border":""}`}>
    //         <div className="input-container" onClick={focus}>
    //             <input
    //             required 
    //             type="text"
    //             onClick={()=>setVisible(prev=>!prev)} 
    //             className={`${className} ${error?"error":""}`} 
    //             name={name} 
    //             value={selectTitle}
    //             placeholder={placeholder}
    //             readOnly
    //             />
    //             <span className="text-field-line"></span>
    //         </div>
	// 	</div>
    //         <div className={`options`}>
    //         {
    //             items.map((item, index)=>(
    //                 <div key={index} onClick={()=>change(getTitle(item), getValue(item))} data-value={getValue(item)}>{(typeof(item) !== "string" && item.icon)?item.icon:null}{getTitle(item)}</div>
    //             ))
    //         }
    //         </div>
    //     </div>
    // )

    return(
        <>
            <div className={`select-field ${border?"border":""}`}>
                <div className="input-container" onClick={show}>
                    <input
                    required 
                    type="text"
                    className={`${className} ${error?"error":""}`} 
                    name={name} 
                    value={selectTitle}
                    placeholder={placeholder}
                    readOnly
                    />
                    <span className="text-field-line"></span>
                </div>
            </div>
        </>
    )
}