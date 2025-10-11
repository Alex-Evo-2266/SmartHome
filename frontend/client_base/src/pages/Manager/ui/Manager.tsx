import { useCallback, useEffect, useState } from "react"
import { useModulesAPI } from "../api/moduleAPI"
import { AllModulesData, ModuleData } from "../models/modules"
import { Loading } from "@src/shared/ui/Loading"
import { Check, FAB, ListContainer, ListItem, Plus } from "alex-evo-sh-ui-kit"
import './ManagerPage.scss'


export const ModuleManagerPage = () => {

    const {getModulesAll, loading} = useModulesAPI()
    const [allModules, setModules] = useState<AllModulesData>({})
    const [selectModule, setSelectModule] = useState<ModuleData | null>(null)

    const load = useCallback(async()=>{
        const data = await getModulesAll()
        if(data)
            setModules(data)
    },[getModulesAll])

    useEffect(()=>{
        load()
    },[load])

    if(loading)
        return(
            <Loading></Loading>
    )

    if(selectModule){
        return(
            <div></div>
        )
    }

    return (
        <div className="manager-page">
            <ListContainer>
                {
                    Object.entries(allModules).map(([path, data])=>{
                        return(
                        <ListItem onClick={()=>setSelectModule(data)} header={data.name} text={path} icon={data.load? <Check primaryColor="#00aa00"/>: <i></i>}>
                        </ListItem>
                        )
                    })
                }
            </ListContainer>
            <FAB icon={<Plus/>}/>
        </div>
    )
}