import { ListContainer, ListItem, MoreVertical } from "alex-evo-sh-ui-kit"
import { useContext } from "react"
import { ManagerContext } from "../../lib/context"
import { IconButtonMenu } from "@src/shared"
import { useCoreAPI } from "@src/entites/moduleManager"


export const CoreList:React.FC = () => {

    const {core} = useContext(ManagerContext)
    const {restartModule} = useCoreAPI()

    const restart = (id:string) => {
        restartModule(id)
    }

    return(
        <ListContainer>
            {
                core.map((data)=>{
                    return(
                        <ListItem
                        header={data.name} 
                        text={data.container_id} 
                        control={<IconButtonMenu icon={<MoreVertical/>} autoHide blocks={[{items:[{
                            title: "restart",
                            onClick: ()=>restart(data.container_id),
                        }]}]}/>}
                        />
                    )
                })
            }
        </ListContainer>
    )
}