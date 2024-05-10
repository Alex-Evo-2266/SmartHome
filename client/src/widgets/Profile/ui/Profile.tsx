import './Profile.scss'
import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { BaseActionCard, Card } from "alex-evo-sh-ui-kit"
import { AuthType, UserData } from "../../../entites/User/model/user"
import userDefault from '../../../shared/img/userNuN.png'
import { useCallback } from 'react'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'
import { SessionListDialog } from '../../Sessions'

interface ProfileSettingsProps{
    className?:string
}

export const Profile = ({className}:ProfileSettingsProps) => {

    const user = useAppSelector(state=>state.user)
    const auth = useAppSelector(state=>state.auth)

    return(
        <Card className={className} header='Profile' action={<ProfineCardAction user={user}/>}>
            <div className="profile-container">
				<div className='img-container'>
					{
						(user.imageUrl)?
						<img alt="profile_img" src={user.imageUrl}/>:
						<img alt="profile_img" src={userDefault}/>
					}
				</div>
				<p>Name: {user.name}</p>
				<p>Email: {user.email||"NuN"}</p>
				<p>Role: {auth.role.toLocaleLowerCase()}</p>
				<p>Authorization type: {user.authType?.toLocaleLowerCase()}</p>
            </div>
        </Card>
    )
}

interface ProfineCardActionProps{
	user:UserData
}

function ProfineCardAction({user}:ProfineCardActionProps) {

	const dispatch = useAppDispatch()

	const showSession = useCallback(() => {
		dispatch(showDialog(<SessionListDialog onHide={()=>dispatch(hideDialog())}/>))
	},[dispatch])

	return(
		<BaseActionCard>
			{
			(user.authType === AuthType.LOGIN)?
			<>
				<NavLink to = "/settings" className="btn">Edit profile</NavLink>
				<NavLink to = "/profile/edit/password" className="btn">Edit password</NavLink>
			</>:(user.authType === AuthType.AUTH_SERVICE)?
			<>
				<a href= {`${user.host}/profile/edit`} className="btn">Edit profile</a>
				<a href = {`${user.host}/profile`} className="btn">Edit password</a>
			</>:null
			}
			<button onClick={showSession} className="btn">Sessions</button>
		</BaseActionCard>
	)
}