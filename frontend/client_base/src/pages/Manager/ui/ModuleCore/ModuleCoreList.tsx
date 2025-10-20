import { Check, ListContainer, ListItem, MoreVertical } from "alex-evo-sh-ui-kit"
import { useContext } from "react"
import { ManagerContext } from "../../lib/context"
import { ModuleData } from "@src/entites/moduleManager/modules/modules"
import { useNavigate } from 'react-router-dom';
import { IconButtonMenu } from "@src/shared";
import { useCoreModulesAPI } from "@src/entites/moduleManager";


export const CoreModuleList:React.FC = () => {

    const {coreModuler} = useContext(ManagerContext)
    const {installModule} = useCoreModulesAPI()
    const navigate = useNavigate()

    const clickModule = (data: ModuleData) => {
        navigate(`/manager/core-module/${data.name_module}`)
    }

    const install = (data: string) => {
        installModule(data)
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
                        control={<IconButtonMenu icon={<MoreVertical/>} blocks={[{items:[{
                            title: "install",
                            onClick: ()=>install(data.name_module),
                        }]}]}/>}
                        />
                    )
                })
            }
        </ListContainer>
    )
}