import { Check, ListContainer, ListItem, MoreVertical } from "alex-evo-sh-ui-kit"
import { useContext } from "react"
import { ManagerContext } from "../../lib/context"
import { IconButtonMenu } from "@src/shared";
import { useCoreModulesAPI } from "@src/entites/moduleManager";
import { ModuleData } from "@src/entites/moduleManager/modules/modules";


export const CoreModuleList:React.FC = () => {

    const {coreModuler, reload} = useContext(ManagerContext)
    const {installModule, deleteModule} = useCoreModulesAPI()

    function click<T>(f: (...arg: T[])=>void, ...arg: T[]){
        return (e?:React.MouseEvent<HTMLButtonElement>) => {
            e?.stopPropagation()
            f(...arg)
            setTimeout(reload, 100)
        }
    }

    function getMenu(data: ModuleData){
        const items = []
        if(data.load)
            items.push({
                title: "delete",
                onClick: click(deleteModule, data.name_module)
            })
        else
            items.push({
                title: "install",
                onClick: click(installModule, data.name_module)
            })
        return items
    }

    return(
        <ListContainer>
            {
                coreModuler.map((data)=>{
                    return(
                        <ListItem
                        header={data.name_module} 
                        text={data.repo} 
                        icon={data.load? <Check primaryColor="#00aa00"/>: <i></i>}
                        control={<IconButtonMenu icon={<MoreVertical/>} autoHide blocks={[{items:getMenu(data)}]}/>}
                        />
                    )
                })
            }
        </ListContainer>
    )
}