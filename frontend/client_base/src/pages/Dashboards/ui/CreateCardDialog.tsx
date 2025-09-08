import { MENU_ROOT_ID } from "@src/const"
import { DashboardCard } from "@src/entites/dashboard"
import { Form, FullScreenTemplateDialog } from "alex-evo-sh-ui-kit"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

const TYPES_CARD = [
    {title: "Grid", value: "grid"}
]

export interface ICreateCardDialog{
    onSave: (data: DashboardCard) => void
    onHide: ()=>void
    data?: DashboardCard
}

export const CardDialog:React.FC<ICreateCardDialog> = ({onSave, data, onHide}) => {

    const [card, setCard] = useState<DashboardCard>({title:"", type:"grid", items:[]})
    const [error, setError] = useState<Record<string, string>>({})

    const changeValue = (name: string, value: string) => {
        setCard(prev=>({...prev, [name]:value}))
    }

    const hide = () => {
        onHide()
    }

    const valid = () => {
        let isValid = true
        if(!card.title || card.title === "")
        {
            setError(prev=>({...prev, title: "invalid title"}))
            isValid = false
        }
        return isValid
    }

    const save = () => {
        if(valid())
        {
            onSave({...card, id: uuidv4()})
            onHide()
        }
    }

    useEffect(()=>{
        if(data)
            setCard(data)
    },[data])

    return(
        <FullScreenTemplateDialog onHide={hide} onSave={save}>
            <div>
                <Form changeValue={changeValue} value={card} errors={error}>
                    <Form.TextInput name="title" border/>
                    <Form.SelectInput name="type" items={TYPES_CARD} border container={document.getElementById(MENU_ROOT_ID)}/>
                </Form>
            </div>
        </FullScreenTemplateDialog>
    )
}