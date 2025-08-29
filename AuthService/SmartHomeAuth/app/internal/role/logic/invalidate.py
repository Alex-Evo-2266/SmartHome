from app.internal.role.logic.get_privilege import get_privilege_by_role_id

def invalidate_privilege_by_role_id(role_id: str):
	get_privilege_by_role_id.cache_invalidate(role_id)