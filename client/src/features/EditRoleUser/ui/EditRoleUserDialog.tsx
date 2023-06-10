import { useCallback, useState } from "react"
import { UserData, UserRole, getRole } from "../../../entites/User"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideDialog } from "../../../shared/lib/reducers/dialogReducer"
import { BaseActionCard, BasicTemplateDialog, Button, SelectField } from "../../../shared/ui"
import { INewRole } from "../models/updateRole"
import { useUpdateRole } from "../api/setRole"

interface EditRoleUserDialogProps{
    user: UserData,
    update: ()=>void
}

export const EditRoleUserDialog = ({user, update}:EditRoleUserDialogProps) => {

    const dispatch = useAppDispatch()
    const {updateRole} = useUpdateRole()
    
    const [newRole, setNewRole] = useState<INewRole>({
        id: user.id || Number(null),
        role: user.role || UserRole.WITHOUT
    })

    const save = useCallback(() => {
        updateRole(newRole)
        dispatch(hideDialog())
        update()
    },[updateRole, newRole, update])

    const changeHandler = useCallback((value: string) => {
        setNewRole(prev=>({...prev, role: getRole(value)}))
    },[])

    function getRoles() {
        let items:string[] = []
        for(let key in UserRole)
            items.push(key)
        return items
    }

    return(
        <BasicTemplateDialog header="Edit role user" action={
            <BaseActionCard>
                <Button onClick={()=>dispatch(hideDialog())}>Cancel</Button>
                <Button onClick={save}>Save</Button>
            </BaseActionCard>
        }>
            <div>
                <p>user name: {user.name}</p>
                <SelectField items={getRoles()} value={newRole.role} onChange={changeHandler}/>
            </div>
        </BasicTemplateDialog>
    )
}