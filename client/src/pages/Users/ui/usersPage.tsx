import { useCallback, useEffect, useState } from 'react'
import { GridLayout, GridLayoutItem } from "alex-evo-sh-ui-kit"
import './usersPage.scss'
import { UserData, useUserAllAPI } from '../../../entites/User'
import { UserCard } from '../../../widgets/UserCard'

export const UsersPage = () => {

    const [users, setUsers] = useState<UserData[]>([])
    const {allUserInit} = useUserAllAPI()

    const getUsers = useCallback(async() => {
        const data = await allUserInit()
        if(data)
            setUsers(data)
    },[allUserInit])

    useEffect(()=>{
        getUsers()
    },[getUsers])

    return(
        <div className='users-page'>
            <GridLayout>
            {
                users.map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <UserCard user={item} update={getUsers}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
        </div>
    )
}