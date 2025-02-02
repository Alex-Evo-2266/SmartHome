
export type ChangeField = {
    creation:boolean
    deleted: boolean
    name: boolean
    address:boolean
	control:boolean
	high:boolean
	low:boolean
	icon:boolean
	type:boolean
	unit:boolean
	enum_values:boolean
	value:boolean
}

export type OptionSchema = {
    address: boolean
	token: boolean
	type_get_data: boolean
	fields_creation: boolean
	fields_change: ChangeField
	creation_url?: string
	change_url?: string
	class_img?: string
	init_field: boolean
	virtual: boolean
}

export type DeviceClassOptions = OptionSchema & {
    class_name: string
}
