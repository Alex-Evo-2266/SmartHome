import { useCallback, useEffect, useState } from 'react'
import { Card, ListContainer, Search } from '../../../shared/ui'
import { ScriptButtons } from './ScriptButton'
import './ScriptCard.scss'
import { ScriptsItem } from './ScriptItem'
import { Script } from '../../../entites/Script'

interface ScriptsCardProps{
	className?: string
    onAddScripts:()=>void
    onEditScripts:(data: Script)=>void
    onDeleteScripts:(system_name: string)=>void
    loading: boolean
    scripts: Script[]
    update: ()=>void
}

export const ScriptsCard = ({className, onAddScripts, onEditScripts, loading, scripts, onDeleteScripts}:ScriptsCardProps) => {

    const [filtredScript, setScript] = useState<Script[]>([])
    const [search, setSearch] = useState<string>("")

    const filterdScript = useCallback((data:string)=>{
		if(data===""){
			setScript(scripts)
			return
		}
		let array = scripts.filter(item => item.name.toLowerCase().indexOf(data.toLowerCase())!==-1)
		setScript(array)
	},[scripts])

	useEffect(()=>{
		filterdScript(search)
	},[filterdScript, search])

    const addScript = useCallback(()=>{
        onAddScripts()
    },[])

    return(
        <Card className={`automations-list-card ${className ?? ""}`} header='Scripts' action={<ScriptButtons onAddScript={addScript}/>}>
            <div className='search-automation'>
                <Search autoChenge onSearch={data=>setSearch(data)}/>
            </div>
            <div className='automations-list'>
            {
                (loading)?
                <div> loding....</div>:
                <ListContainer transparent>
                    {
                        filtredScript.map((item, index)=>(
                            <ScriptsItem key={index} scriptsData={item} onDeleteScript={onDeleteScripts} onEditScript={onEditScripts}/>
                        ))
                    }
                </ListContainer>
                
            }
            </div>
        </Card>
    )
}
