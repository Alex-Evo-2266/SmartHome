import { DialogPortal } from "@src/shared"
import { SelectionDialog } from "alex-evo-sh-ui-kit"
import { TriggerKind } from "../../model/editorTypes"

const kinds: {title: string, data: TriggerKind}[] = [{
    title: "устройство",
    data: "device"
},{
    title: "устройство в комнате",
    data: "room"
},{
    title: "время",
    data: "time"
}]

export const AddTrigger = ({onHide, onSuccess}:{onSuccess: (kind:TriggerKind)=>void, onHide: ()=>void}) => {

    return (
        <DialogPortal>
            <SelectionDialog header="" items={kinds} onSuccess={onSuccess} onHide={onHide}/>
        </DialogPortal>
    )
}