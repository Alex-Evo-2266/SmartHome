import {useCallback, useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { useSessionsAPI } from '../api/sessionsApi'
import { ISession } from '../models/session'
import { mapResponseSessionToSession } from '../lib/helpers/mapSessionData'
import { BaseActionCard, BasicTemplateDialog, Button, ListContainer, ListItem } from 'alex-evo-sh-ui-kit'
import { IconButton } from 'alex-evo-sh-ui-kit'
import { Trash } from 'lucide-react'
import './SessionDialog.scss'

interface SessionListDialogProps{
    onHide?: ()=> void
}

export const SessionListDialog = ({onHide}:SessionListDialogProps) => {

    const {getSessions, deleteSessions} = useSessionsAPI()
	const [sessions, setSessions] = useState<ISession[]>([])
	const dispatch = useDispatch()

	const getAllSessions = useCallback(async()=>{
		const data = await getSessions()
		if (data)
			setSessions(mapResponseSessionToSession(data))
	},[getSessions])

	const deleteSession = useCallback(async(id: number) =>{
		try{
			await deleteSessions(id)
      await getAllSessions()
		}catch{}
	},[deleteSessions, dispatch, getAllSessions])

	useEffect(()=>{
		getAllSessions()
	},[getAllSessions])

    const getText = (data:ISession) => {
        return `auth_type:${data?.auth_type}; expires_at:${data?.expires_at.toDateString()}`
    }
    
  return(
	<BasicTemplateDialog onHide={onHide} action={<BaseActionCard><Button onClick={onHide}>ok</Button></BaseActionCard>}>
	  <div className="session-dialog">
        <ListContainer transparent>
        {sessions?.map((item, index)=>{
          return(
            <ListItem 
            hovered 
            key={index} 
            className="card-field" 
            header={`session id: ${item.id}`} 
            text={getText(item)} 
            control={<IconButton onClick={()=>deleteSession(item.id)} icon={<Trash color='#ef4444'/>}/>}
            />
          )
        })}
        </ListContainer>
    </div>
	</BasicTemplateDialog>
  )
}
