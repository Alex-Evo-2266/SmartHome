import { MENU_ROOT_ID } from "@src/const"
import { DashboardCard } from "@src/entites/dashboard"
import { Form, FormRef, FullScreenTemplateDialog } from "alex-evo-sh-ui-kit"
import { useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

const TYPES_CARD = [
    {title: "Grid", value: "grid"}
]

export interface ICreateCardDialog{
    onSave: (data: DashboardCard) => void
    onHide: ()=>void
    data?: DashboardCard
}

type FormDashboardCard = Omit<DashboardCard, "id" | "type">

export const CardDialog:React.FC<ICreateCardDialog> = ({onSave, data, onHide}) => {

    const [error, setError] = useState<Record<string, string>>({})
    const form = useRef<FormRef<DashboardCard>>(null)

    const valid = (card: unknown): card is FormDashboardCard => {
        let isValid = true
        if( card &&
            typeof(card) === "object" &&
            "title" in card &&
            typeof(card.title) === "string" && 
            card.title !== ""
        )
        {
            setError(prev=>({...prev, title: "invalid title"}))
            isValid = false
        }
        return isValid
    }

    const finishHandler = (newData: Partial<DashboardCard>) => {
        if(valid(newData))
            onSave({...newData, id: uuidv4(), type: "grid", items: []})
    }

    const hide = () => {
        onHide()
    }

    const save = () => {
        form.current?.submit()
    }

    return(
        <FullScreenTemplateDialog onHide={hide} onSave={save}>
            <div>
                <Form<DashboardCard> 
                ref={form} 
                onFinish={finishHandler} 
                value={data ?? {
                    title: "",
                    type: "grid",
                    items: []
                }} 
                errors={error}
                >
                    <Form.TextInput name="title" border/>
                    <Form.SelectInput name="type" items={TYPES_CARD} border container={document.getElementById(MENU_ROOT_ID)}/>
                </Form>
            </div>
        </FullScreenTemplateDialog>
    )
}