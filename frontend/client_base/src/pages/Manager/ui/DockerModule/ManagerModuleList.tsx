import { Check, ListContainer, ListItem } from "alex-evo-sh-ui-kit"
import { useContext } from "react"
import { ManagerContext } from "../../lib/context"
import { ModuleData } from "@src/entites/moduleManager/modules/modules"
import { useNavigate } from 'react-router-dom';


export const DockerModuleList:React.FC = () => {

    const {dockerModules} = useContext(ManagerContext)
    const navigate = useNavigate()

    const clickModule = (data: ModuleData) => {
        navigate(`/manager/docker/${data.name_module}`)
    }

    return(
        <ListContainer>
            {
                dockerModules.map((data)=>{
                    return(
                        <ListItem
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