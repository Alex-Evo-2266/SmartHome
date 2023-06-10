import './Profile.scss'
import { NavLink } from "react-router-dom"
import { logout } from "../../../entites/User"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { Card, IconButton } from "../../../shared/ui"
import { AuthType } from "../../../entites/User/model/user"
import userDefault from '../../../shared/img/userNuN.png'
import { LogOut } from "lucide-react"

interface ProfileSettingsProps{
    className?:string
}

export const Profile = ({className}:ProfileSettingsProps) => {

    const dispatch = useAppDispatch()
    const user = useAppSelector(state=>state.user)
    const auth = useAppSelector(state=>state.auth)

    return(
        <Card className={className}>
            <div className="profile-container">
            <div className = {`container glass-normal`}>
                <IconButton icon={<LogOut/>} onClick={()=>dispatch(logout())}/>
			<div className = "pagecontent">
				<h2>Profile</h2>
				<div className='img-container' style={{borderRadius:"50%", overflow:"hidden"}}>
					{
						(user.imageUrl)?
						<img alt="profile_img" src={user.imageUrl}/>:
						<img alt="profile_img" src={userDefault}/>
					}
				</div>
				<p>User Name: {user.name}</p>
				<p>User Email: {user.email||"NuN"}</p>
				<p>User Role: {auth.role}</p>
				<p>User authorization type: {user.authType}</p>
				<div className="dividers"></div>
				<div className="controlElement">
				{
					(user.authType === AuthType.LOGIN)?
					<>
						<NavLink to = "/profile/edit" className="btn">Edit profile</NavLink>
						<NavLink to = "/profile/edit/password" className="btn">Edit password</NavLink>
					</>:(user.authType === AuthType.AUTH_SERVICE)?
					<>
						<a href= {`${user.host}/profile/edit`} className="btn">Edit profile</a>
						<a href = {`${user.host}/profile`} className="btn">Edit password</a>
					</>:null
				}
				{/* <button onClick={showSession} className="btn">Sessions</button> */}
			  </div>
			</div>
		  </div>
            </div>
        </Card>
    )
}