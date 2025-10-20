import { FullScreenTemplateDialog, TextField, Typography } from "alex-evo-sh-ui-kit"
import { EditNode } from "../context/context"
import { ChangeEvent, useCallback, useState } from "react"
import { useScriptAPI } from "../../../entites/script/api/scriptAPI"
import { useDebounce } from "../../../shared"

export interface EditNodeDialogProps {
    onHide: ()=>void
    data: EditNode
    onSave: (data: EditNode)=>void
}

export const EditNodeDialog:React.FC<EditNodeDialogProps> = ({onHide, data, onSave}) => {

    const [expression, setExpression] = useState<string>(data.expression)
    const {scriptCheck} = useScriptAPI()
    const [error, setError] = useState<string | null>(null)

    const check = useCallback(async(text:string)=>{
        const data = await scriptCheck(text)
        console.log(data)
        if(!data.result){
            setError(data.message)
        }
        else{
            setError(null)
        }
    },[scriptCheck])

    const debouncedCheck = useDebounce(check, 300)
    
    const changeHandler = useCallback(async(e: ChangeEvent<HTMLInputElement>) => {
        setExpression(e.target.value)
        debouncedCheck(e.target.value)
    },[debouncedCheck])

    const save = useCallback(()=>{
        onSave({...data, expression})
    },[onSave, expression, data])

    return(
        <FullScreenTemplateDialog onHide={onHide} onSave={save}>
            <div>
                <Typography type='title'>{data.type}</Typography>
            </div>
            <div>
                <TextField error={!!error} errorText={error} border value={expression} onChange={changeHandler}/>
            </div>
        </FullScreenTemplateDialog>
    )
}