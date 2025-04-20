import { BaseActionCard, BasicTemplateDialog, Button, DayOfWeekField, SelectionDialog, TextField } from "alex-evo-sh-ui-kit"
import { DialogPortal, SelectField, TimeField } from "../../../shared"
import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import {TriggerItem} from '../../../entites/automation';
import {DateTime} from 'luxon'

interface AddTriggerProps {
  onHide: ()=>void
  onSave: (data: TriggerItem)=>void
}

const SERVICES = ["device", "time"];
const OBJECT_ENABLE = ["device"];
const FIELD_ENABLE = ["device"];
const OBJECT_REQUIRED = ["device"];

function formatTimeWithOffset(hour:string, minutes: string): string {
    return DateTime.now().set({hour:parseInt(hour), minute:parseInt(minutes), second:0}).toFormat('HH:mm:ssZZ');
}

function getTime(time:string):string{
    const strs = time.split(":")
    return `${strs[0]}:${strs[1]}`
}

export const AddTrigger: React.FC<AddTriggerProps> = ({onHide, onSave}) => {

    const [service, setService] = useState("device")
    const [object, setObject] = useState("")
    const [option, setOption] = useState("")
    const [data, setData] = useState("")

    const [objectSecrch, setObjectSearch] = useState(false)
    const [dataSecrch, setDataSecrch] = useState(false)

    const {devicesData} = useAppSelector(state=>state.devices)

    const serviceHeandler = (value: string) => {
        setService(prev=>{
            if(prev != value){
                setObject("")
            }
            return value
        })
    }

    const objectHeandler = (value: string) => {
        setObject(prev=>{
            if(prev != value){
                setData("")
            }
            return value
        })
    }
    
    const timeHandler = (value:string) => {
        const strs = value.split(":")
        setData(formatTimeWithOffset(strs[0], strs[1]))
    }

    const objectWeekHeandler = (data: string[]) => {
        const value = data.filter(item=>item !== "").join(", ")
        setOption(value)
    }

    const getObject = useCallback(()=>{
        if(service == "device"){
            return devicesData.map(item=>({title: item.name, data: item.system_name}))
        }
        return []
    },[service, devicesData])


    const getData = useCallback(()=>{
        if(service == "device"){
            const device = devicesData.find(item=>item.system_name === object)
            if(!device)
                return []
            return device.fields?.map(item2 => ({title: item2.name, data: item2.name})) ?? []
        }
        return []
    },[service, object, devicesData])

    const save = useCallback(()=>{
        console.log(service, object, data)
        if((service !== "" && object !== "" && data !== "") || (service === "time" && data !== ""))
        onSave({service, object, data, option})
    },[service, object, data, onSave])


    return(
        <>
        <BasicTemplateDialog 
        header="select trigger" 
        onHide={onHide} 
        action={
            <BaseActionCard>
                <Button styleType="text" onClick={onHide}>cancel</Button>
                <Button styleType="text" onClick={save}>save</Button>
            </BaseActionCard>
        }
        >
            <div style={{padding: "10px"}}>
                <SelectField onChange={serviceHeandler} value={service} border items={SERVICES} placeholder="service"/>
                {OBJECT_ENABLE.includes(service) && (
                    <TextField placeholder="Object" border readOnly value={object} onClick={() => setObjectSearch(true)} />
                )}
                {service === "time" && (
                    <>
                        <DayOfWeekField className="automation-week" value={option.split(',').map(item=>item.trim()).filter(item=>item !== '')} onChange={objectWeekHeandler}/>
                        <TimeField border value={getTime(data)} onChange={timeHandler}/>
                    </>
                )}
                {FIELD_ENABLE.includes(service) && (object || !OBJECT_REQUIRED.includes(service)) && (
                    <TextField placeholder="Field" border readOnly value={data} onClick={() => setDataSecrch(true)} />
                )}
            </div>
        </BasicTemplateDialog>
        {
            objectSecrch &&
            <DialogPortal>
                <SelectionDialog header="get object" items={getObject()} onHide={()=>setObjectSearch(false)} onSuccess={objectHeandler}/>
            </DialogPortal>
        }
        {
            dataSecrch &&
            <DialogPortal>
                <SelectionDialog header="get data" items={getData()} onHide={()=>setDataSecrch(false)} onSuccess={setData}/>
            </DialogPortal>
        }
        </>
        
    )
}