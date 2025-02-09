export enum ReceivedDataFormat {
    JSON = "json",
    STRING = "string",
  }
  
export enum StatusDevice {
    ONLINE = "online",
	OFFLINE = "offline",
	NOT_SUPPORTED = "not_supported",
	UNLINK = "unlink",
	UNKNOWN = "unknown"
  }
  
  export  enum DeviceGetData {
    PULL = "pull",
	PUSH = 'push'
  }
  
  export enum TypeDeviceField {
    BINARY = "binary",
	NUMBER = "number",
	TEXT = "text",
	ENUM = "enum",
	BASE = "base",
	COUNTER = "counter"
  }
  
  export interface DeviceSerializeFieldSchema {
    id: string;
    name: string;
    address?: string | null;
    type: TypeDeviceField;
    low?: string | null;
    high?: string | null;
    enum_values?: string | null;
    read_only: boolean;
    icon: string;
    unit?: string | null;
    entity?: string | null;
    entity_list_id?: string[] | null;
    virtual_field: boolean;
    value?: string | null;
  }
  
  export interface DeviceSerializeSchema {
    name: string;
    system_name: string;
    class_device: string;
    type: string;
    address?: string;
    token?: string;
    type_command: ReceivedDataFormat;
    type_get_data: DeviceGetData;
    status: StatusDevice;
    fields?: DeviceSerializeFieldSchema[];
  }
  
  export interface DeviceSchema extends DeviceSerializeSchema {
    value?: { [key: string]: string } | null;
  }
  
  export interface ValueSerializeSchema {
    id: string;
    datatime: string;
    value: string;
    field?: DeviceSerializeFieldSchema | null;
  }
  