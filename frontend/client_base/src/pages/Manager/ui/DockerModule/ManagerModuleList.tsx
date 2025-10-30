import { ModuleData } from "@src/entites/moduleManager/modules/modules"
import { Check, ListContainer, ListItem } from "alex-evo-sh-ui-kit"
import { useContext } from "react"
import { useNavigate } from 'react-router-dom';

import { ManagerContext } from "../../lib/context"


export const DockerModuleList:React.FC = () => {

    const {dockerModules} = useContext(ManagerContext)
    const navigate = useNavigate()

    const clickModule = (data: ModuleData) => {
        navigate(`/manager/docker/${data.name_module}`)
    }

    return(
        <ListContainer>
            {
                dockerModules.map((data, index)=>{
                    return(
                        <ListItem
                        key={`${data.name_module}-${index}`}
                        onClick={()=>clickModule(data)} 
                        header={data.name_module} 
                        text={data.repo} 
                        icon={data.load? <Check primaryColor="#00aa00"/>: <i></i>}
                        />
                    )
                })
            }
        </ListContainer>
    )
}