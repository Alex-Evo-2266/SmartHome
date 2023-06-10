import { UserRole } from "../.."

export const getRole = (role: string | UserRole | undefined) => {
    let newRole = UserRole.WITHOUT
    if(role === UserRole.ADMIN || role === "admin")
		newRole = UserRole.ADMIN
    else if(role === UserRole.BASE || role === "base")
		newRole = UserRole.BASE
    return newRole
}