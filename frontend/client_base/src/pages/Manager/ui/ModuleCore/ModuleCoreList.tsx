import { Check, ListContainer, ListItem } from "alex-evo-sh-ui-kit"
import { useContext } from "react"
import { ManagerContext } from "../../lib/context"
import { ModuleData } from "@src/entites/moduleManager/modules/modules"
import { useNavigate } from 'react-router-dom';


export const CoreModuleList:React.FC = () => {

    const {coreModuler} = useContext(ManagerContext)
    const navigate = useNavigate()

    const clickModule = (data: ModuleData) => {
        navigate(`/manager/core-module/${data.name_module}`)
    }

    return(
        <ListContainer>
            {
                coreModuler.map((data)=>{
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