import './ProfileSettings.scss'
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { Card, TextField } from "../../../shared/ui"
import { AuthType, UpdateUserData } from "../../../entites/User/model/user"
import userDefault from '../../../shared/img/userNuN.png'
import { ProfileSettingsButtons } from './ProfileSettingsButton'
import { useCallback, useEffect, useState } from 'react'
import { useSaveUserData } from '../api/saveUserData'

interface ProfileSettingsProps{
	className?:string
}

export const ProfileSettings = ({className}:ProfileSettingsProps) => {

	const user = useAppSelector(state=>state.user)
	const {saveUserData} = useSaveUserData()
	const [profileForm, setProfileForm] = useState<UpdateUserData>({
		name: user.name ?? "", 
		email: user.email ?? ""
	})

	useEffect(()=>{
		setProfileForm({
			name: user.name ?? "", 
			email: user.email ?? ""
		})
	},[user])

	const changeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
		setProfileForm(prev=>({...prev, [e.target.name]: e.target.value}))
	}

	const outForm = useCallback(() => {
		saveUserData(profileForm)
	},[saveUserData, profileForm])

	return(
		<Card className={className} header='Profile settings' action={<ProfileSettingsButtons onSave={outForm}/>}>
			<div className="profile-settings-container">
				<div className = {`container glass-normal`}>
					<div className = "pagecontent">
						<div className='img-container'>
							{
								(user.imageUrl)?
								<img alt="profile_img" src={user.imageUrl}/>:
								<img alt="profile_img" src={userDefault}/>
							}
						</div>
						<div className='field-container'>
							<TextField border onChange={changeHandler} name="name" value={profileForm.name} placeholder='name'/>
						</div>
						<div className='field-container'>
							<TextField border onChange={changeHandler} name="email" value={profileForm.email} placeholder='email' readOnly={user.authType === AuthType.AUTH_SERVICE}/>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}