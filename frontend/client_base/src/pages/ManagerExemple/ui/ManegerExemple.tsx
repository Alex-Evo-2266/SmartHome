import { ArrowLeft, Button, IconButton, ListContainer, ListItem, Panel, Typography } from 'alex-evo-sh-ui-kit';
import { useParams } from 'react-router-dom';
import { useModulesAPI } from '@src/entites/moduleManager';
import { useCallback, useEffect, useState } from 'react';
import { ModuleData } from '@src/entites/moduleManager/modules/modules';
import { Loading } from '@src/shared/ui/Loading';
import { useNavigate } from 'react-router-dom';

export const ManagerExemplePage:React.FC = () => {

    const {getModule, loading, installModule} = useModulesAPI()
    const [modules, setModules] = useState<ModuleData | null>(null)
    const { module_name } = useParams<{module_name: string}>();
    const navigate = useNavigate()

    const load = useCallback(async()=>{
        if(!module_name) return
        const data = await getModule(module_name)
        if(data)
            setModules(data)
    },[getModule, module_name])

    const clickContainer = (data: string) => {
        navigate(`/manager/${module_name}/${data}`)
    }

    const install = async () => {
        if(!module_name) return
        await installModule(module_name)
        setTimeout(()=>load(),100)
    }
    
    useEffect(()=>{
        load()
    },[load])

    if(loading)
        return(
            <Loading></Loading>
        )

    if(!modules)
    {
        return(
            <div className="manager-page">
                <Panel>
                    <IconButton icon={<ArrowLeft/>} onClick={()=>navigate(-1)}/>
                    <Typography type="title">{module_name}</Typography>
                    <Typography type="body">модуль не найден</Typography>
                </Panel>
            </div>
        )
    }

    return(
        <div className="manager-page">
            <Panel>
                <IconButton icon={<ArrowLeft/>} onClick={()=>navigate(-1)}/>
                <Typography type="title">{module_name}</Typography>
                <br/>
                {
                    modules.load_module_name.length > 0?
                    <>
                        <Button onClick={install}>Установка</Button>
                        <Typography type="body">Установленны</Typography>
                        <ListContainer>
                        {
                            modules.load_module_name.map(item=>(
                                <div>
                                    {item.name}
                                </div>
                            ))
                        }
                        </ListContainer>
                    </>:
                    <>
                        <Typography type="body">Установка</Typography>
                        <Button onClick={install}>Установка</Button>
                    </>
                }
            </Panel>
        </div>
    )
}