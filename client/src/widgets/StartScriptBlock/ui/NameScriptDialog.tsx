import { useCallback, useState } from "react"
import { Divider, FilledButton, FullScrinTemplateDialog, TextField } from "alex-evo-sh-ui-kit"
import './NameScriptDialog.scss'
 
interface ScriptNameDialogProps{
    onHide:()=>void
    onSave:(name: string, systemName: string)=>void
    header?: string
    beginSystemName?: string
    beginName?: string
}

export const ScriptNameDialog = ({onHide, header = "Script Name", onSave, beginSystemName = "", beginName = ""}:ScriptNameDialogProps) => {

    const [name, setName] = useState<string>(beginName)
    const [systemName, setSystemName] = useState<string>(beginSystemName)

    const save = useCallback(() => {
        if(name == "" || systemName == "")
            return
        onSave(name, systemName)
    },[systemName, name])

    const changeName = useCallback((event:React.ChangeEvent<HTMLInputElement>) => {
        if(!systemName || systemName == name)
            setSystemName(event.target.value)
        setName(event.target.value)
    },[systemName, name])

    return(
        <FullScrinTemplateDialog header={header} onHide={onHide} onSave={save}>
            <div className="script-name-container">
			    <TextField border className="transparent" placeholder="name" onChange={changeName} value={name}></TextField>
            </div>
            <div className="script-name-container">
                <TextField border className="transparent" placeholder="system name" onChange={(e)=>setSystemName(e.target.value)} value={systemName}></TextField>
            </div>
            <Divider/>
            <div className="script-name-container">
                <p>automation name: {systemName}.automation</p>
                <p className="additional-information">This is the name of the automation that the script will be linked to. automation will be created if at least one trigger is entered.</p>
            </div>
            <Divider/>
        </FullScrinTemplateDialog>
    )
}