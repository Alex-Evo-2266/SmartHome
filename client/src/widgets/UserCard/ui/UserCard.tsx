import { UserData, UserRole } from '../../../entites/User'
import { BaseActionCard, Button, Card } from '../../../shared/ui'
import userDefault from '../../../shared/img/userNuN.png'
import './UserCard.scss'
import { useAppDispatch, useAppSelector } from '../../../shared/lib/hooks/redux'
import { useNavigate } from 'react-router-dom'
import { showDialog } from '../../../shared/lib/reducers/dialogReducer'
import { EditRoleUserDialog } from '../../../features/EditRoleUser'

interface UserCardProps{
    user: UserData
	update: ()=>void
}

export const UserCard = ({user, update}:UserCardProps) => {

	const auth = useAppSelector(state=>state.user)
	const navigation = useNavigate()
	const dispatch = useAppDispatch()

    const editClick = () => {
		if(auth.id === user.id){
			navigation('/settings')
		}
		else{
			dispatch(showDialog(<EditRoleUserDialog user={user} update={update}/>))
		}
    }

    return(
        <Card className='users-card' header={user.name} action={
            <BaseActionCard>
                <UserCardAction onClick={editClick} user={user}/>
            </BaseActionCard>
        } imgSrc={user.imageUrl ?? userDefault}>
            <p>Email: {user.email}</p>
            {
                (user.authName)?
                <p>Auth name: {user.authName}</p>:null
            }
            <p>Role: {user.role}</p>
        </Card>
    )
}

interface UserCardActionProps{
    onClick?: ()=>void
    user: UserData
}

function UserCardAction({onClick, user}:UserCardActionProps) {

	const auth = useAppSelector(state => state.auth)

	if(auth.role !== UserRole.ADMIN && auth.id !== user.id)
		return null

    return(
        <div className='user-card-action'>
            <Button onClick={onClick}>edit</Button>
        </div>
    )
}