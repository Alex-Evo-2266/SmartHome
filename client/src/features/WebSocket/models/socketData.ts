
export enum SocketTypes{
    DEVICE = "devices"
}

interface ISocketDataOther{
    type: string
    data: any | any[]
}

export type SocketData = ISocketDataOther