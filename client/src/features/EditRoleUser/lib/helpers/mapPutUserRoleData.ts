import { UserRole } from "../../../../entites/User";
import { INewRole } from "../../models/updateRole";

export const mapPutUserRoleData = (data: INewRole) => {
    let role = 'none'
    if(data.role === UserRole.ADMIN)
        role = 'admin'
    if(data.role === UserRole.BASE)
        role = 'base'
    return{
        id: data.id,
        role: role
    }
}