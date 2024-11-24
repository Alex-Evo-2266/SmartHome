import { Button, ContentBox, Divider, IconButton, ListContainer, ListItem, Trash } from "alex-evo-sh-ui-kit"
import { DeviceClassOptions } from "../models/options"
import { useCallback, useState } from "react"
import { FieldData } from "../models/deviceData"
import { DialogPortal } from "../../../shared"
import { AddField } from "./addFieldDialog"
import { EditField } from "./editField"

interface DeviceDataProps{
    option: DeviceClassOptions
    fields: FieldData[]
    onChange: (data: FieldData[]) => void
}

export const FieldList:React.FC<DeviceDataProps> = ({option, fields, onChange}) => {

    const [addFieldVisible, setAddFieldVisible] = useState(false)
    const [editFieldVisible, setEditFieldVisible] = useState<null | {data: FieldData, index: number}>(null)

    const deleteField = useCallback((index: number) => {
        const newFields = fields.filter((_, i)=>index !== i)
        onChange(newFields)
    },[fields, onChange])

    const addField = useCallback((data: FieldData) => {
        const newFields = fields.slice()
        newFields.push(data)
        onChange(newFields)
        setAddFieldVisible(false)
    },[fields])

    const editField = useCallback((index: number, data: FieldData) => {
        const newFields = fields.slice()
        newFields[index] = data
        onChange(newFields)
        setEditFieldVisible(null)
    },[fields])

    const getField = useCallback((index: number) => {
        const data = fields.find((_, i) => i === index)
        return data? {data, index}: null
    },[fields])

    return(
        <>
        {
        option.fields_creation && 
        <div>
            <ContentBox label="field" hiding border>
                <Divider/>
                <ListContainer transparent>
                    {
                        fields.length > 0?
                        fields.map((item, index)=>(
                            <ListItem 
                            key={index} 
                            onClick={()=>setEditFieldVisible(getField(index))}
                            hovered
                            header={item.name}
                            text={`address: ${item.address}`}
                            control={
                                <IconButton
                                transparent
                                className="icon-delete-btn"
                                icon={<Trash/>}
                                onClick={()=>deleteField(index)}
                                />
                            }/>
                        )):
                        <ListItem header="not field"/>
                    }
                </ListContainer>
                <Divider/>
                <Button onClick={()=>setAddFieldVisible(true)} styleType='filledTotal'>+</Button>
            </ContentBox>
        </div>
        }
        {
            editFieldVisible &&
            <DialogPortal>
                <EditField data={editFieldVisible.data} option={option} onHide={()=>setEditFieldVisible(null)} onSave={data=>editField(editFieldVisible.index, data)}/>
            </DialogPortal>
        }
        {
            addFieldVisible && 
            <DialogPortal>
                <AddField onHide={()=>setAddFieldVisible(false)} onSave={addField}/>
            </DialogPortal>
        }
        </>
    )
}
